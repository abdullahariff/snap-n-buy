import React from 'react';
import './App.css';
import { Input, Icon, Button, Card, Image } from 'semantic-ui-react';
import _ from 'lodash';
import $ from 'jquery';
import searchImage from './service'


function Mast () {
  return (
    <img src='assets/mast.png' alt='Mast' className='mast'/>
  )
}

function Home () {
  return (
    <img src='assets/home.png' alt='Home' className='home'/>
  )
}

function ImagePreview(props) {
  return (
    <img 
      src={props.url}
      alt="The capture will appear in this box."
      id='image-output'
    />
  )
}

function Tags(props) {
  return (
    <div className="tags">
      {props.labels.map((value, index) => {
        return (
          <Button key={index} size='large'>
            {value}
          </Button>
        )
      })}
      </div>
  )
}

function Result(props) {
  let tags = null;
  if (props.data && props.data.hasOwnProperty('tags')) {
    tags = _.orderBy(props.data.tags, ['score'], ['desc'])
      .map(t => t.name.charAt(0).toUpperCase() + t.name.slice(1));
  }

  return (
    <div>
      <ImagePreview url={props.image_url}/>
      <hr />
      {tags &&
        <Tags labels={tags} />
      }
      {props.data && props.data.hasOwnProperty('matches') &&
        <ProductResults products={props.data.matches}/>
      }
    </div>
  )
}

function Product(props) {
  const data = props.data;
  return (
    <Card className='product'>
      <Image src={data.image_url} wrapped ui={false} />
      <Card.Content>
        <Card.Description>
          {data.description}
        </Card.Description>
      </Card.Content>
      <Card.Content>
        <strong>£{data.price}</strong>
      </Card.Content>
    </Card>
  )
}

function ProductResults(props) {
  const products = _.orderBy(props.products, ['score'], ['desc'])
  return (
    <div className='product-results'>
      {products.map((value, index) => {
          return (
            <Product key={index} data={value} />
          )
        })}
    </div>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {file: null};

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const el = $('#image-input');
    console.log(el[0]);
    const file = URL.createObjectURL(e.target.files[0]);
    this.setState({...this.state, file: file})
    searchImage(el[0])
      .then(result => {
        this.setState({...this.state, data: result});
      })
  }

  render() {
    const data = this.state.data;

    return (
      <div className="App">
        {!this.state.file &&
          <Mast />
        }

        <header>
          <div className='search-bar-wrapper'>
            <Input 
              action={
                <label for='image-input'>
                  <Icon name='photo' bordered inverted color='black' size='large' />
                </label>
              }
              icon='search'
              placeholder='Search...'
              iconPosition='left'
              className='search-bar'
            />
          </div>

          <input
            type='file'
            name='photo'
            accept='image/*'
            capture='user'
            id='image-input'
            value={this.state.image_url}
            onChange={this.handleChange}/>
        </header>

        {!this.state.file ? (
          <Home />
        ) : (
          <Result data={data} image_url={this.state.file}/>
        )}
      </div>
    );
  }
}

export default App;
