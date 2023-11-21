import React, { Component } from 'react';
import { Searchbar } from 'components/Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';
import { DataImages } from './Key/Key';

export class App extends Component {
  state = {
    images: [],
    isLoading: false,
    isOpenModal: false,
    dataModal: null,
    value: '',
    page: 1,
    error: null,
  };

  getDataImages = async () => {
    try {
      this.setState({
        isLoading: true,
      });

      const response = await DataImages(this.state.value, this.state.page);
      const { hits, totalHits } = response.data;
      if (hits.length < 1) {
        alert('Sorry, nothing was found for your request...');
        return;
      }
      this.setState(prevState => {
        return {
          images: [...prevState.images, ...hits],
          totalHits: totalHits,
        };
      });
    } catch (error) {
      this.setState({ error: error.message });
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  };

  componentDidUpdate(_, prevState) {
    if (
      prevState.value !== this.state.value ||
      prevState.page !== this.state.page
    ) {
      this.getDataImages();
    }
  }

  onHandleClickSubmit = value => {
    if (value.trim() === '') {
      alert('Invalid value entered');
      return;
    }

    this.setState({ value, images: [], page: 1 });
  };

  onHandleClickLoadMore = e => {
    this.setState(prevState => {
      return {
        page: prevState.page + 1,
      };
    });
  };

  openModal = dataImage => {
    this.setState({
      isOpenModal: true,
      dataModal: dataImage,
    });
  };

  closeModal = () => {
    this.setState({
      isOpenModal: false,
      dataModal: null,
    });
  };

  render() {
    return (
      <div>
        <Searchbar onSubmit={this.onHandleClickSubmit} />
        {this.state.images.length !== 0 && (
          <ImageGallery
            arrayData={this.state.images}
            openModal={this.openModal}
          />
        )}
        {this.state.page < Math.ceil(this.state.totalHits / 12) && (
          <Button onClick={this.onHandleClickLoadMore} />
        )}
       {this.state.isLoading && (<Loader isLoading={this.state.isLoading} />)}
        {this.state.isOpenModal && (
          <Modal
            dataModal={this.state.dataModal}
            closeModal={this.closeModal}
          />
        )}
      </div>
    );
  }
}