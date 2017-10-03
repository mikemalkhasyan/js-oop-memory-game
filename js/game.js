
var Game = function(options){
    this.width = null;
    this.height = null;
    this.images = [];
    this.thumbs = [];
    /**
     *  es nra hamar a vor 2 hatic avel click chlni
     */
    this.clickedCounter = 0;
    this.score = 0;
    /**
     * initialize game with given parameters
     */
    this.timer = null;
    this.won = false;
    this.interval = {};
    this.currentlyFlipped = [];
    this.init = function(){
        /**
         * set initial paraeters or our game
         */
        this.width = options.width || 4;
        this.height = options.height || 3;
        this.images = _this.shuffle(options.images);
        this.questionSrc = options.question;
        this.constructDiv($("#" + options.container));
        this.container = $("#" + options.container).find(".board");
        this.bar =  $("#" + options.container).find(".bar");
        this.flipBackTime = options.flipBackTime || 500;
        this.timer = options.timer || 30 * 1000;
        this.lostMessage = options.lostMessage || "You lost";
        this.winMessage = options.winMessage || "You win";
        this.renderGame();
        this.startTimer();
    };
    /**
     *  shuffle images
     */
    this.shuffle = function(images){
        var shuffled = [];
        while( 0 !== images.length){
            var index = Math.floor(Math.random() * images.length);
            shuffled.push( images[index] );
            images.splice(index, 1);
        }
        return shuffled;
    };
    /**
     *  core
     */
    this.constructDiv = function(container){
        container.html("");
        var bar = $("<div class='bar'>")
                    .append($("<div class='time'>"))
                    .append($("<div class='score'>"));
        container.append( bar );
        container.append( $("<div class='board'></div>") )
    };
    /**
     *  Draw game in give div element
     */
    this.renderGame = function(){
        var questions = this.generateThumbs(this.questionSrc);
        this.questionThumb = questions[0].html();
        this.thumbs = this.generateThumbs();
        questions.map(function(thumb){
            _this.container.append(thumb);
        })
    };

    /**
     * for each image make jquey object
     */
    this.generateThumbs = function(source){
        var src = (typeof source === "undefined") ? null : source;
        var thumbs = [];
        var numberOfImages = (this.width * this.height) / 2;
        var images = this.images.slice(0,numberOfImages);

        //nuynic iran kpcel vor amen nkaric 2 hat lini
        images = images.concat(images);
        images = _this.shuffle(images);
        var couter = 0;
        //vazel nkarneri vrayov u amen meki hamar sarqel jquey object
        images.map(function(item){
            if( null ==  source ){
                var image = $("<img>").attr("src", item)
            }else{
                var image = $("<img>").attr("src", source)
            }

            var thumb = $("<div>")
                        .addClass("thumb")
                        .attr('data-index', couter++)
                        .attr('flipped',"false")
                        .append(image)
                        .css({
                            width : (100 / _this.width) + "%",
                            display: "inline-block"
                        })
                        .on("click", _this.clickHandler);
            thumbs.push(thumb);
        });

        return thumbs;
    };

    
    this.clickHandler = function(e){
        var flag = false;
	if($(this).attr("flipped") == "true"){
		alert("This cube is already flipped.");
	}else if( _this.clickedCounter < 2 ){
            var index = parseInt($(this).data("index"));
            var jqThis = $(this);
            _this.currentlyFlipped.map(function(item){
                if( item.attr("data-index") === index ){
                    flag = true;
                }
            });
           
            if (!flag){
                _this.flipImage(index);
                _this.clickedCounter++;
            
                if(_this.clickedCounter === 2){
                    _this.checkState();
                }
            }
        }
    };
    this.flipImage = function(dataIndex){
        var thumb = this.container.find("[data-index="+ dataIndex +"]");
        switch( thumb.attr("flipped") ){
            case "true":{
                thumb.html( this.questionThumb );
                thumb.attr("flipped","false");
                break;
            }
            case "false":{
                var image = this.thumbs[dataIndex];
                thumb.html( image.html() );
                thumb.attr("flipped", "true");
                break;
            }
            default:{
                break;
            }
        }
        //tarmacnel es pahin frcracner@
        _this.currentlyFlipped = _this.getFlipped();
    };

    this.checkState = function(){
        var flipped = [];
        var items = [];
        _this.container.find("[flipped=true]").each(function(e){
            flipped.push( $(this).find("img").attr("src") );
            items.push($(this));
        });

        if(flipped[0] == flipped[1]){
            _this.score+=2;
            //add score
            _this.bar.find(".score").html(_this.score)

            items.map(function(item){
                item.attr("flipped", "finished");
            })
        }else{
            _this.flipBack();
        }

        if( _this.score >= _this.width * _this.height ){
            _this.won = true;
            setTimeout(function(){
                clearInterval(_this.interval);
                alert(_this.winMessage)
            }, 50)
        }else{
            _this.clickedCounter = 0;
        }

    };
    this.flipBack = function(){
        setTimeout(function(){
            _this.currentlyFlipped.map(function(item){
                var index = parseInt(item.attr("data-index"));
                _this.flipImage(index)
            });
            _this.clickedCounter = 0;
        }, this.flipBackTime)
        
    };
    
    this.getFlipped = function(){
        var items = [];
        _this.container.find("[flipped=true]").each(function(){
            items.push($(this))
        });
        return items;
    };
    

    
    this.startTimer = function(){
        setTimeout(function(){
            //vor chlni kttcnel
            _this.clickedCounter = 3;
            if( !_this.won ){
                alert(_this.lostMessage);
            }
        }, _this.timer)
        
        var time = _this.timer;
        
        _this.bar.find(".score").html(_this.score)
        _this.bar.find(".time").html(Math.ceil(time/1000));
        
        this.interval = setInterval(function(){
            time = time - 1000;
            _this.bar.find(".time").html(Math.ceil(time/1000));
            if( time < 0 ){
                clearInterval(_this.interval);
            }
        },1000)
        
    };
    var _this = this;
    
    this.init();
    
    return this;
};

game = new Game({
    width: 4,
    height: 3,
    images:[
        "images/1.png",
        "images/2.png",
        "images/3.png",
        "images/4.png",
        "images/5.png",
        "images/6.png",
        "images/7.png"
    ],
    question: "images/question.png",
    flipBackTime: 500,
    lostMessage: "You lost!!!",
    winMessage: "You win!!!",
    timer : 100000000,
    container: "game"
});








