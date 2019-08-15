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
        if (!this.auto_continue_story) {
            return;
        }
        var paragraph_index = 0;
        var delay = 0.0;
        var complete_text = ""
        while(this.ink_story.canContinue) {
            var paragraph_text = this.ink_story.Continue();
            complete_text = complete_text + '\n' + paragraph_text;
        }

        this.displayText(complete_text);
        this.auto_continue_story = false;

        for(var i = 0; i < this.choices.length; i++) {
            this.choices[i].destroy();
        }
        this.choices = [];
        this.ink_story.currentChoices.forEach((choice) => {
            this.displayChoice(choice.text, choice.index);
        });
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
        //text_object.strokeThickness = 2;
        //text_object.addStrokeColor('#ff0000', 13);
        //text_object.addStrokeColor('#00000000', 20);
        
        return text;
    },
    displayText: function(text) {
        this.display_text.destroy();
        this.display_text = game.add.text(32, 32, "Intro text\nline\nline", this.text_style_body);
        
        text = this.parseText(text, this.display_text);
        this.display_text.setText(text);
    },
    displayChoice: function(text, target) {
        var previous_end = this.display_text.height;
        if (this.choices.length > 0) {
            previous_end = this.choices[this.choices.length - 1].y + this.choices[this.choices.length - 1].height;
        }
        var new_choice = game.add.text(32, previous_end + 32, text, this.text_style_choices);
        new_choice.setStyle(new_choice.style, true);

        new_choice.choice_destination = target;

        new_choice.inputEnabled = true;
        new_choice.events.onInputDown.add((obj, pointer) => {
            obj.style.fill = "#ffffff";
            obj.setStyle(obj.style, true);
            this.ink_story.ChooseChoiceIndex(obj.choice_destination);
            this.auto_continue_story = true;
        });
        new_choice.events.onInputOver.add((obj, pointer) => {
            obj.style.fill = "#ff2222";
            obj.setStyle(obj.style, true);
        });
        new_choice.events.onInputOut.add((obj, pointer) => {
            obj.style.fill = "#8f8f8f";
            obj.setStyle(obj.style, true);
        });
        

        this.choices.push(new_choice);
    }
}

game = new Phaser.Game(750, 900, Phaser.AUTO);
game.state.add('GameNarrative', GameNarrative);
game.state.start('GameNarrative');