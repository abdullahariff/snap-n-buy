import React from 'react';
import './App.css';
import { Input, Icon } from 'semantic-ui-react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {file: null};

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const url = URL.createObjectURL(e.target.files[0]);
    this.setState({file: url})
  }

  render() {
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
        <img 
          src={this.state.file}
          alt="The capture will appear in this box."
          id='image-output'
        />
      </div>
    );
  }
}

export default App;
