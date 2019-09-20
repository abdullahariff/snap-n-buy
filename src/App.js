import React from "react";
import "./App.css";
import { Input, Icon, Button, Card, Image, Modal } from "semantic-ui-react";
import _ from "lodash";
import $ from "jquery";
import searchImage from "./service";

function Mast() {
  return <img src="assets/mast.png" alt="Mast" className="mast" />;
}

function ImagePreview(props) {
  return (
    <div className="image-output-wrapper">
      <img
        src={props.url}
        alt="The capture will appear in this box."
        id="image-output"
      />
      {props.hotspots &&
        props.hotspots.map((value, index) => {
          return <Hotspot key={index} coords={value.coords} />;
        })}
    </div>
  );
}

function Hotspot(props) {
  const img = document.getElementById("image-output");
  const imageWidth = img.naturalWidth;
  const imageHeight = img.naturalHeight;
  const leftPercent = (props.coords[0] / imageWidth) * 100;
  const topPercent = (props.coords[1] / imageHeight) * 100;
  return (
    <div
      className="hotspot"
      style={{
        left: `${leftPercent}%`,
        top: `${topPercent}%`
      }}
    />
  );
}

function Home(props) {
  return (
    <>
      <Modal open={props.modalOpen}>
        <Modal.Content image>
          <label for="image-input">
            <img
              src="/assets/modal-content.png"
              alt="modal popup"
              width="100%"
            />
          </label>
        </Modal.Content>
      </Modal>
      <img src="assets/home.png" alt="Home" className="home" />
    </>
  );
}

function Tags(props) {
  return (
    <div className="tags">
      {props.labels.map((value, index) => {
        return (
          <Button key={index} size="large">
            {value}
          </Button>
        );
      })}
    </div>
  );
}

function Result(props) {
  let tags;
  let hotspots;

  if (props.data && props.data.hasOwnProperty("tags")) {
    tags = _.orderBy(props.data.tags, ["score"], ["desc"]).map(
      t => t.name.charAt(0).toUpperCase() + t.name.slice(1)
    );
  }
  if (props.data && props.data.hasOwnProperty("hotspots")) {
    hotspots = props.data.hotspots;
  }

  return (
    <div>
      <ImagePreview url={props.image_url} hotspots={hotspots} />
      <hr />
      {tags && <Tags labels={tags} />}
      {props.data && props.data.hasOwnProperty("matches") && (
        <ProductResults products={props.data.matches} />
      )}
    </div>
  );
}

function Product(props) {
  const data = props.data;
  return (
    <Card className="product">
      <img
        src="assets/love.svg"
        style={{
          position: "absolute",
          right: 0,
          padding: "3px",
          width: "24px"
        }}
      />
      <Image src={data.image_url} wrapped ui={false} />
      <Card.Content>
        <Card.Description>{data.description}</Card.Description>
      </Card.Content>
      <Card.Content>
        <strong>£{data.price}</strong>
      </Card.Content>
    </Card>
  );
}

function ProductResults(props) {
  const products = _.orderBy(props.products, ["score"], ["desc"]);
  return (
    <div className="product-results">
      {products.map((value, index) => {
        return <Product key={index} data={value} />;
      })}
    </div>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { file: null, modalOpen: false };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const el = $("#image-input");
    const file = URL.createObjectURL(e.target.files[0]);
    this.setState({ ...this.state, file: file, modalOpen: false });
    searchImage(el[0]).then(result => {
      this.setState({ ...this.state, data: result });
    });
  }

  toggleModal() {
    this.setState({ modalOpen: !this.state.modalOpen });
  }

  render() {
    const data = this.state.data;

    return (
      <div className="App">
        {!this.state.file && <Mast />}

        <header>
          <div className="search-bar-wrapper">
            <Input
              onClick={() => this.setState({ modalOpen: true })}
              action={
                <img
                  onClick={this.toggleModal.bind(this)}
                  name="photo"
                  bordered
                  inverted
                  color="black"
                  size="large"
                  src="assets/camera.svg"
                  alt="camera icon"
                />
              }
              icon="search"
              placeholder="Search..."
              iconPosition="left"
              className="search-bar"
            />
          </div>

          <input
            type="file"
            name="photo"
            accept="image/*"
            capture="camcorder"
            id="image-input"
            value={this.state.image_url}
            onChange={this.handleChange}
          />
        </header>

        {!this.state.file ? (
          <Home {...this.toggleModal} modalOpen={this.state.modalOpen} />
        ) : (
          <Result data={data} image_url={this.state.file} />
        )}
      </div>
    );
  }
}

export default App;
