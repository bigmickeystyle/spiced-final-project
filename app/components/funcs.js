module.exports = {
    toggleOptions: function (option, thisState) {
        option = option.toLowerCase();
        var isPaneOpen = `${option}Pane`;
        var toggleOn = {};
        var toggleOff = {};
        toggleOn[isPaneOpen] = {
            open: true,
            locked: false
        };
        toggleOff[isPaneOpen] = {
            open:false,
            locked: false
        };
        if(thisState.state[isPaneOpen].open){
            thisState.setState(toggleOff);
        }else if(!thisState.state[isPaneOpen].open){
            thisState.setState(toggleOn);
        }
    },

    toggleLock: function (option, thisState, pane) {
        var isPaneOpen = `${option}Pane`;
        var toggleOn = {};
        var toggleOff = {};
        toggleOn[isPaneOpen] = {
            open: true,
            locked: true
        };
        toggleOff[isPaneOpen] = {
            open:true,
            locked: false
        };
        if(thisState.state[isPaneOpen].locked){
            thisState.setState(toggleOff);
            $(`#${pane}-lock`).attr('src', './images/unlocked.png');
            $(`#${pane}`).css({border: 'none'});
        } else if(!thisState.state[isPaneOpen].locked){
            thisState.setState(toggleOn);
            $(`#${pane}-lock`).attr('src', './images/locked.png');
            $(`#${pane}`).css({border: '5px blue solid'});
        }
    }
};
