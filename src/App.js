import React from 'react';
import './App.css';
import { Input, Icon, Button } from 'semantic-ui-react';
import * as _ from 'lodash';

const url = 'http://970c4ea3.ngrok.io/image-search';

function imageSearch(image) {
  return {
    "matches": [
      {
        "SKU": "SOFSCT046BLU-ME",
        "description": "Charley Accent Chair, Midnight Grey Velvet",
        "image_url": "http://www.made.com/image.jpg",
        "price": "179.00",
        "style": "sexy",
        "type": "seating",
        "score": 0.987
      },
      {
        "SKU": "TABSCT046RED-ME",
        "description": "Bloody solid oak table",
        "image_url": "http://www.made.com/image2.jpg",
        "price": "173.00",
        "style": "hard",
        "type": "table",
        "score": 0.987
      }
    ],
    "hotspots": [
      {
        "product_type": "seating",
        "coords": [100, 150],
      },
      {
        "product_type": "table",
        "coords": [260, 355],
      }
    ],
    "tags": [
      {
        "name": "armchairs",
        "score": 0.75
      },
      {
        "name": "chairs",
        "score": 0.90
      },
    ]
  }
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

function Tag(props) {
  return (
    <Button size='large'>
      {props.name}
    </Button>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {file: 'https://z2photorankmedia-a.akamaihd.net/media/f/3/a/f3aynk4/original.jpg'};

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const url = URL.createObjectURL(e.target.files[0]);
    this.setState({file: url})
  }

  render() {
    const data = imageSearch();
    const tags = _.orderBy(data.tags, ['score'], ['desc'])
      .map(t => t.name.charAt(0).toUpperCase() + t.name.slice(1));

    return (
      <div className="App">
        <header>
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

          <input
            type='file'
            accept='image/*'
            capture='user'
            id='image-input'
            value={this.state.image_url}
            onChange={this.handleChange}/>
        </header>

        <ImagePreview url={this.state.file}/>

        <hr />

        <div className="tags">
          {tags.map((value, index) => {
            return <Tag key={index} name={value} />
          })}
        </div>
      </div>
    );
  }
}

export default App;
