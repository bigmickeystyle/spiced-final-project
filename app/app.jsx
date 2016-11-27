var React = require('react');
var ReactDOM = require('react-dom');
var {Route, Router, IndexRoute, hashHistory} = require('react-router');
var Main = require('Main');
var Player = require('Player');
var About = require('About');
var News = require('News');

require('style!css!foundation-sites/dist/foundation.min.css');
$(document).foundation();

ReactDOM.render(
  <Router history={hashHistory}>
      <Route path="/" component={Main}>
          <Route path="about" component={About}/>
          <Route path="news" component={News}/>
          <IndexRoute component={Player}/>
      </Route>
  </Router>,
  document.getElementById('app')
);
