var React = require('react');
var ReactDOM = require('react-dom');
var expect = require('expect');
var $ = require('jQuery');
var TestUtils = require('react-addons-test-utils');

var PlayerForm = require('PlayerForm');

describe('PlayerForm', () => {
    it('should exist', () => {
        expect(PlayerForm).toExist();
    });

    it('should call onSubmit if non empty input is submitted', () => {
        var spy = expect.createSpy();
        var playerForm = TestUtils.renderIntoDocument(<PlayerForm onSubmit={spy}/>);
        var $el = $(ReactDOM.findDOMNode(playerForm));

        playerForm.refs.artist.value = 'bjork';
        TestUtils.Simulate.submit($el.find('form')[0]);
        expect(spy).toHaveBeenCalledWith('bjork');
    });

    it('should not call onSubmit if an empty input is submitted', () => {
        var spy = expect.createSpy();
        var playerForm = TestUtils.renderIntoDocument(<PlayerForm onSubmit={spy}/>);
        var $el = $(ReactDOM.findDOMNode(playerForm));

        playerForm.refs.artist.value = '';
        TestUtils.Simulate.submit($el.find('form')[0]);
        expect(spy).toNotHaveBeenCalled();
    });
});
