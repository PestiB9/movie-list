import React from 'react';
import { ActivityIndicator, Alert, Dimensions, FlatList, Image, TouchableOpacity, View } from 'react-native';
import { Page } from '.';
import { readDisk, writeDisk } from '../disk';
import { searchMovies } from '../http';
import { Movie } from '../model';
import { Input } from './Input/Input';
import { Text } from './Text';

const IMAGE_WIDTH = Dimensions.get('window').width - 32;
const borderStyle = {borderWidth: 1, borderRadius: 8, borderColor: 'rgba(0,0,0,.6)'};

interface State {
  hiddenList: Movie[];
  favouriteList: Movie[];
  isLoading: boolean;
  searchText: string;
  movieData: Movie[];
}

export class MovieListClass extends React.PureComponent<{}, State> {
  state = {
    hiddenList: [],
    favouriteList: [],
    isLoading: false,
    searchText: '',
    movieData: [],
  }
  timer: number = 0;

  saveOnDisk = () => {
    const {hiddenList, favouriteList} = this.state;
    writeDisk({hiddenList, favouriteList});
    this.timer = setTimeout(() => this.saveOnDisk(), 3000);
  }

  async componentDidMount() {
    const {hiddenList, favouriteList} = await readDisk();
    this.setState({hiddenList, favouriteList });
    this.timer = setTimeout(() => this.saveOnDisk(), 3000);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  setFavouriteList = (newFavourites: Movie[]) => {
    this.setState({favouriteList: newFavourites});
  }

  setHiddenList = (newHidden: Movie[]) => {
    this.setState({hiddenList: newHidden});
  }

  setSearchText = (text: string) => {
    this.setState({searchText: text});
  }

  addToFavourites = (movie: Movie) => {
    const {favouriteList} = this.state;
    if(!favouriteList.find(favouriteMovie => favouriteMovie.imdbID === movie.imdbID)) {
      this.setState({favouriteList: [...favouriteList, movie]});
    }
  }

  removeFromFavourites = (movieID: string) =>  {
    const {favouriteList} = this.state;
    const newList = favouriteList.filter(el => el.imdbID !== movieID);
    this.setState({favouriteList: newList});
  }

  addToHidden = (movie: Movie) => {
    const {hiddenList} = this.state;
    if(!hiddenList.find(hiddenMovie => hiddenMovie.imdbID === movie.imdbID)) {
      this.setState({hiddenList: [...hiddenList, movie]});
    }
  }

  fetchData = () => {
    const {searchText, hiddenList} = this.state;
    try {
      this.setState({isLoading: true}, async() => {
        const response: Movie[] = await searchMovies(searchText);
        const filteredData = response.filter(el => !hiddenList.find(hidden => hidden.imdbID  === el.imdbID));
        this.setState({movieData: filteredData, isLoading: false});
      });
    } catch(error) {
      this.setState({movieData: [], isLoading: false});
      Alert.alert(error.message);
    }
  }

  renderEmptyComponent = () => {
    return (<View><Text>The research did not produce any result</Text></View>);
  }

  renderFavouriteEmptyComponent = () => {
    return (<View><Text>No favourite in the list</Text></View>);
  }

  renderItem = ({item}: {item: Movie}) => {
    const {favouriteList, hiddenList} = this.state;
    const isItemFavourite = !!favouriteList.find(el => el.imdbID === item.imdbID);
    const isItemHidden = !!hiddenList.find(el => el.imdbID === item.imdbID);
    return (
      <View style={{marginVertical: 8}}>
        <Image style={{backgroundColor: 'rgba(0,0,0,.7)', width: IMAGE_WIDTH, height: IMAGE_WIDTH * 9 / 16}} source={{uri: item.Poster}} />
        <Text>{item.Title}</Text>
        <Text>{item.Year}</Text>
        <View style={{flexDirection: 'row', flex: 1}}>
          {!isItemFavourite && (
            <TouchableOpacity disabled={isItemFavourite} onPress={() => this.addToFavourites(item)} style={{flex: 1, marginRight: 12, ...borderStyle, padding: 12}}><Text>Favourite</Text></TouchableOpacity>
          )}
          {!isItemHidden && (
            <TouchableOpacity disabled={isItemHidden} onPress={() => this.addToHidden(item)} style={{...borderStyle, padding: 12, flex: 1}}><Text>Hide</Text></TouchableOpacity>
          )}
        </View>
      </View>
    )
  }

  renderFavouriteItem = ({item}: {item: Movie}) => {
    return (
      <View style={{marginVertical: 8}}>
        <Image style={{backgroundColor: 'rgba(0,0,0,.7)', width: IMAGE_WIDTH, height: IMAGE_WIDTH * 9 / 16}} source={{uri: item.Poster}} />
        <Text>{item.Title}</Text>
        <Text>{item.Year}</Text>
        <View style={{flexDirection: 'row', flex: 1}}>
          <TouchableOpacity onPress={() => this.removeFromFavourites(item.imdbID)} style={{...borderStyle, padding: 12, flex: 1}}><Text>Remove</Text></TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    const {isLoading, searchText, movieData, favouriteList} = this.state;
    return (
      <Page>
        <View style={{flexDirection: 'row', flex: 1, padding: 16, marginBottom: 24, ...borderStyle}}>
          <Input placeholder={'Type a title and click search to search'} style={{flex: 1}} onChangeText={this.setSearchText} value={searchText} />
          <TouchableOpacity style={{marginLeft: 8}} onPress={this.fetchData} disabled={isLoading || !searchText}><Text>Search</Text></TouchableOpacity>
        </View>
        <TouchableOpacity style={{...borderStyle, padding: 8, marginBottom: 12}} onPress={() => this.setFavouriteList([])}><Text>Clear favourite list</Text></TouchableOpacity>
        <TouchableOpacity style={{...borderStyle, padding: 8, marginBottom: 12}} onPress={() => this.setHiddenList([])}><Text>Clear hidden list</Text></TouchableOpacity>
        {!(isLoading) && searchText && (
          <FlatList data={movieData} keyExtractor={(el) => el.imdbID}
            renderItem={this.renderItem} ListEmptyComponent={this.renderEmptyComponent} />
        )}
        {isLoading && (
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size={'large'} />
          </View>
        )}
        {!searchText && (
          <FlatList data={favouriteList} renderItem={this.renderFavouriteItem} ListEmptyComponent={this.renderFavouriteEmptyComponent} />
        )}
      </Page>
    );
  }
}