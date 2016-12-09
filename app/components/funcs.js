module.exports = {
    toggleOptions: function (option, thisState) {
        option = option.toLowerCase();
        var isPaneOpen = `${option}PaneOpen`;
        var toggleOn = {};
        var toggleOff = {};
        toggleOn[isPaneOpen] = true;
        toggleOff[isPaneOpen] = false;
        console.log(isPaneOpen);
        if(thisState.state[isPaneOpen]){
            thisState.setState(toggleOff);
        }else if(!thisState.state[isPaneOpen]){
            thisState.setState(toggleOn);
        }
    }
};
