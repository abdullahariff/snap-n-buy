import React from 'react';
import './App.css';
import { Input, Icon, Button, Card, Image } from 'semantic-ui-react';
import * as _ from 'lodash';

const url = 'http://970c4ea3.ngrok.io/image-search';

function imageSearch(image) {
  return {
    "matches": [
      {
        "SKU": "SOFSCT046BLU-ME",
        "description": "Charley Accent Chair, Midnight Grey Velvet",
        "image_url": "https://res.cloudinary.com/made-com/image/upload/c_pad,d_made.svg,f_auto,w_200,dpr_2.0,q_auto:best/v4/catalog/product/catalog/3/9/5/e/395e6f14eb2ffa641e0e384a7d358385abc11c47_CHALLE012ORA_UK_2x_Lule_High_back_Dining_Chairs_Flame_Orange_Velvet_PL.jpg",
        "price": "179.00",
        "style": "sexy",
        "type": "seating",
        "score": 0.90
      },
      {
        "SKU": "TABSCT046RED-ME",
        "description": "Bloody solid oak table",
        "image_url": "https://res.cloudinary.com/made-com/image/upload/c_pad,d_made.svg,f_auto,w_265,dpr_2.0,q_auto:best/v4/catalog/product/catalog/4/0/a/b/40ab423836fd6d8b9bcc1bd6867e7b5839cb11d7_TBLBOO001BLA_UK_Boone_8_Seat_Dining_Table_Concrete_Resin_Top_Black_PL.jpg",
        "price": "83.00",
        "style": "hard",
        "type": "table",
        "score": 0.95
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
        <Tags labels={tags} />
        <ProductResults products={data.matches}/>
      </div>
    );
  }
}

export default App;
