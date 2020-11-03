import React, { Component } from "react";
import Quote from "./Quote";
import FavoriteQuote from "./FavoriteQuote";
import IconButton from "./IconButton";
import "./styles.scss";

//External
import { SlideDown } from "react-slidedown";
import "react-slidedown/lib/slidedown.css";
import _ from "lodash";

//db
//import MongoClient from 'mongodb';
const { MongoClient } = require("mongodb");

const db_pw = "wLpuVyRPxpQKSWS5tB2DK"; //This is not secure.

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quotes: [],
      currentQuote: [],
      currentQuoteIndex: -1,
      favoriteQuotes: [],
      showFavorites: false
    };
    this.getQuotesFromURL = this.getQuotesFromURL.bind(this);
    this.newRandomQuote = this.newRandomQuote.bind(this);
    this.favoriteCurrentQuote = this.favoriteCurrentQuote.bind(this);
    this.saveFavorites = this.saveFavorites.bind(this);
    this.removeFavoriteQuote = this.removeFavoriteQuote.bind(this);
    this.showHideFavorites = this.showHideFavorites.bind(this);
    this.loadDatabase = this.loadDatabase.bind(this);
  }

  async loadDatabase() {
    const uri =
      "mongodb+srv://sandbox:" +
      db_pw +
      "@thebegining.ua3zi.mongodb.net/<dbname>?retryWrites=true&w=majority";
    const client = new MongoClient(uri);

    async function listDatabases(client) {
      const databasesList = await client.db().admin().listDatabases();

      console.log("Databases:");
      databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
    }

    try {
      await client.connect();

      await listDatabases(client);
    } catch (e) {
      console.error(e);
    } finally {
      await client.close();
    }
  }

  async componentDidMount() {
    const quotesJSON = await this.getQuotesFromURL(
      "https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json"
    );
    const currentQuote = _.sample(quotesJSON);
    const currentQuoteIndex = _.indexOf(quotesJSON, currentQuote);
    const favoriteQuotes = localStorage.getItem("favoriteQuotes")
      ? JSON.parse(localStorage.getItem("favoriteQuotes"))
      : [];
    //const favoriteQuotes = [];
    this.setState({
      quotes: quotesJSON,
      currentQuote: currentQuote,
      currentQuoteIndex: currentQuoteIndex, //I would rather have an ID.
      favoriteQuotes: favoriteQuotes
    });
    console.log("Amo");
    this.loadDatabase();
  }

  getQuotesFromURL(url) {
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson.quotes;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  newRandomQuote() {
    console.log("quotes after", this.state.quotes);
    const currentQuote = _.sample(this.state.quotes);
    const currentQuoteIndex = _.indexOf(this.state.quotes, currentQuote);
    console.log(currentQuote);
    console.log(currentQuoteIndex);
    this.setState({
      currentQuote: currentQuote,
      currentQuoteIndex: currentQuoteIndex //I would rather have an ID.
    });
  }

  favoriteCurrentQuote() {
    const favoriteQuotes = this.state.favoriteQuotes;
    const currentQuoteIndex = this.state.currentQuoteIndex;
    const favoriteIndex = favoriteQuotes.indexOf(currentQuoteIndex);
    if (favoriteIndex >= 0) {
      favoriteQuotes.splice(favoriteIndex, 1);
    } else {
      favoriteQuotes.push(currentQuoteIndex);
    }
    this.saveFavorites(favoriteQuotes);
  }

  removeFavoriteQuote(index) {
    const favoriteQuotes = this.state.favoriteQuotes;
    const favoriteIndex = favoriteQuotes.indexOf(index);
    favoriteQuotes.splice(favoriteIndex, 1);
    this.saveFavorites(favoriteQuotes);
  }

  saveFavorites(favoriteQuotes) {
    localStorage.setItem("favoriteQuotes", JSON.stringify(favoriteQuotes));
    this.setState({
      favoriteQuotes: favoriteQuotes
    });
  }

  showHideFavorites() {
    this.setState((state) => ({ showFavorites: !state.showFavorites }));
    console.log(this.state.showFavorites);
  }

  shareThisQuote(index) {
    const favoriteQuotes = this.state.favoriteQuotes;
    const quoteIndex = favoriteQuotes.indexOf(index);
    const quote = this.state.quotes[quoteIndex];
    let twitterParameters = [];
    twitterParameters.push("text=" + encodeURI(quote["quote"]));
    twitterParameters.push("via=" + encodeURI(quote["author"]));
    const url =
      "https://twitter.com/intent/tweet?" + twitterParameters.join("&");
    window.open(url, "_blank");
  }

  render() {
    const currentFavorite =
      this.state.favoriteQuotes.indexOf(this.state.currentQuoteIndex) >= 0
        ? true
        : false;
    return (
      <div className="App">
        <h1 className="title">{this.state.quotes.length} Random Quotes!</h1>
        <div className="quote-box">
          {this.state.quotes.length !== 0 ? (
            <Quote
              baseClass="current-quote"
              quote={this.state.currentQuote["quote"]}
              author={this.state.currentQuote["author"]}
            ></Quote>
          ) : (
            <Quote
              quote="Loading Quotes"
              author="We apologize for the inconvenience."
            ></Quote>
          )}
        </div>
        <div className="buttons">
          <IconButton
            faStyle="fas fa-fw"
            faName="fa-heart"
            isActive={currentFavorite}
            onClickFunction={this.favoriteCurrentQuote}
          ></IconButton>
          <IconButton
            faStyle="fas fa-fw"
            faName="fa-sync"
            text="New Quote"
            onClickFunction={this.newRandomQuote}
          ></IconButton>
          <IconButton
            faStyle="fas fa-fw"
            faName="fa-stars"
            isActive={this.state.showFavorites}
            text={this.state.favoriteQuotes.length}
            onClickFunction={this.showHideFavorites}
          ></IconButton>
        </div>
        <SlideDown
          className="my-dropdown-slidedown"
          closed={!this.state.showFavorites}
        >
          <div className="favorite-quotes">
            {this.state.favoriteQuotes.map((quoteIndex) => (
              <FavoriteQuote
                quote={this.state.quotes[quoteIndex]["quote"]}
                author={this.state.quotes[quoteIndex]["author"]}
                quoteIndex={quoteIndex}
                removeFavoriteQuote={this.removeFavoriteQuote}
                shareThisQuote={this.shareThisQuote.bind(this)}
              ></FavoriteQuote>
            ))}
          </div>
        </SlideDown>
        <div className="created-by">Skylar Bolton</div>
      </div>
    );
  }
}
export default App;
