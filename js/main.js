// Isaac Karth
// 8/12/2019
// Animation and Tweening

'use strict';

// define game
var game;

var GameNarrative = function(game) {};

GameNarrative.prototype = {
    preload: function() {
        game.load.json('story', 'assets/story/story.json');
    },
    create: function() {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        this.story_data = game.cache.getJSON('story');
        this.ink_story = new inkjs.Story(this.story_data);
        console.log(this.story_data);
        this.auto_continue_story = true;

        this.text_style_body = {
            fill: "#efefef",
            align: "left",
            wordWrap: true,
            wordWrapWidth: 698,
            font: "Roboto Slab",
            fontSize: 16
        }
        this.text_style_choices = {
            fill: "#8f8f8f",
            align: "left",
            wordWrap: true,
            wordWrapWidth: 698,
            font: "Roboto Slab",
            fontSize: 16,
            fontWeight: "bold"
        }
        this.display_text = game.add.text(32, 32, "Intro text\nline\nline", this.text_style_body);
        this.choices = [];
    },
    update: function() {
        this.continueStory();
    },
    render: function() {},
    continueStory: function() {
    },
    parseText: function(text, text_object) {
        text_object.clearFontValues();
        for (var i = 0; i < text.length; i++) {
            if('<i>' == text.slice(i, i+3)) {
                text_object.addColor("#ffff00", i);
                text_object.addFontStyle("italic", i);
                text = text.slice(0, i) + text.slice(i+3);
            }
            if('</i>' == text.slice(i, i+4)) {
                text_object.addColor("#efefef", i);
                text_object.addFontStyle("normal", i);
                text = text.slice(0, i) + text.slice(i+4);
            }
        }

        return text;
    },
    displayText: function(text) {
        this.display_text.destroy();
        this.display_text = game.add.text(32, 32, "Intro text\nline\nline", this.text_style_body);
        
    },
    displayChoice: function(text, target) {

    }
}

game = new Phaser.Game(750, 900, Phaser.AUTO);
game.state.add('GameNarrative', GameNarrative);
game.state.start('GameNarrative');