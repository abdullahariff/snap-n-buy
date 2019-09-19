import React from 'react';
import './App.css';
import { Input, Icon } from 'semantic-ui-react';

function App() {
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

        <input type='file' accept='image/*' id='image-input'/>
      </header>
    </div>
  );
}

export default App;
