;(function(){
    var acceptOpt = ['tmpl', 'el', 'data', 'fuse'];
    var BaseModel = Model.Class({
        get acceptOpt(){
            return acceptOpt;
        },

        set fuse(value){
            Model.addFuse(value, this);

            this._fuse = value;
        },

        get fuse(){
            return this._fuse;
        },
        constructor: function(opt){
            // private method
            this._fuse = "";

            if(opt){
                for(var i = 0; i < this.acceptOpt.length; i ++){
                    var item = this.acceptOpt[i];
                    if(opt[item]){
                        this[item] = opt[item];
                    }
                }
            }


            // 设置初始化参数 private method
            this.eventHandler = {
            };

            this.children = [];
            this.parent = null;
        },

        // 增加model上去
        add: function(model){
            // add parent
            model.parent = this;

            this.children.push(model);
        },

        del: function(model){
            for(var i = 0; i < this.children.length; i ++){
                if(this.children[i] === model){
                    break;
                }
            }

            this.children.splice(i, 1);
        },

        // 这里写处于激活态的时候动作
        // 用户可自定义 
        // 事件传播不在这里处理保证不受用户处理事件传播
        // onactive时的动作
        active: function(event){
        },

        // onunactive时的动作
        unactive: function(event){
        },

        // rock就是主动使其处于激活态
        // 如果其已于激活态 根据关系模型使其子模型处理激活态
        rock: function(event){
            console.log(this.el, "rocked");
            this.status = "active";

            if(! event){
                var event = Model.createEvent({
                    type: "actived",
                    target: this,
                    name: 'anonymouse'
                });
            }

            // active时的动作
            this.active(event);

            this.dispatchEvent(event);
        },

        stop: function(event){
            console.log(this.el, "unrocked");
            this.status = "unactive";

            if(! event){
                event = Model.createEvent({
                    type: "unactived",
                    target: this,
                    name: 'anonymouse'
                });
            }

            this.unactive(event);

            this.dispatchEvent(event);

        },

        // 事件传播
        // 事件由这里开始传播
        // 这里先只处理向上冒泡的情形
        dispatchEvent: function(event){
            var type = event.type;

            var _this = this;
            this.eventHandler[type] && this.eventHandler[type].map(function(item){
                item.call(_this, event);
            });

            // 如果可以穿播 继续传播
            if(event.bubble){
                this.parent && this.parent.dispatchEvent(event);
            }
        },

        addEventListener: function(type, handler, isCapture){
            if(! this.eventHandler[type]){
                this.eventHandler[type] = [];
            }

            this.eventHandler[type].push(handler);
        }
    });

    Model.external("BaseModel", BaseModel);
})();