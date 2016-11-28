var React = require('react');
var ReactDOM = require('react-dom');
var expect = require('expect');
var $ = require('jQuery');
var TestUtils = require('react-addons-test-utils');

var Player = require('Player');

describe('Player', () => {
    it('should exist', () => {
        expect(Player).toExist();
    });
});
