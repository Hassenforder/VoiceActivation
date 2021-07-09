class VoiceControl {
/*
 * control : VoiceActivationControl
 * 
 * horizontal and vertical are the position of the debug popup
 * horizontal : string, describes the position horizontal like in a css way for example (right|left):###px
 * vertical : string, describes the position vertical like in a css way for example (top|bottom):###px
 * balloonsState : {number} : 0 nothing, 1 balloons computed and visible, 2 balloons computed and hidden
 * debugState : {number} : 0 nothing, 1 debug popup built and visible, 2 debug popup built and hidden
 */

    constructor (initialisation, activations, horizontal, vertical) {
        let self = this;
        this.horizontal = horizontal;
        this.vertical = vertical;
        this.control = new VoiceActivationControl(function (level, topic, text) {
            self.handler(level, topic, text);
        });
        this.initialisation(initialisation);
        this.config(activations);
        this.balloonsState = 0;
        this.debugState = 0;
        $('#voice-balloons').on ("change", function (event) {
            if (this.checked) {
                self.openBalloons();
            } else {
                self.closeBalloons();
            }
        });
        $('#voice-debug').on ("change", function (event) {
            if (this.checked) {
                self.openDebug();
            } else {
                self.closeDebug();
            }
        });
        $('#voice-activated').on ("change", function (event) {
            if (this.checked) {
                self.start();
            } else {
                self.stop();
            }
        });
    }

    /*
     * private
     * display a debug message in a popup somewhere if the popup exists and is opened
     */
    debug (topic, text) {
        if (this.debugState !== 1) return;
        const debug = document.querySelector('#va-debug');
        if (debug === null) return;
        if (topic === 'clear') {
            const elements = debug.querySelectorAll('span');
            for (const element of elements) {
                element.textContent = '';
            }
        } else {
            const element = debug.querySelector('.va-debug-'+topic);
            if (element === null) return;
            element.textContent = text;
        }
    }

    /*
     * private
     * handler of notifications from VoiceActivationControl
     * 
     * @param initialisation
     */
    handler (level, topic, text) {
        if (level === 'error') {
            //topic is either onend or onerror
            // reflect the fact that the voice system is down
            $('#voice-activated').prop('checked', false);
        }
        if (level === 'debug') this.debug (topic, text);
        if (level === 'info') {
            switch (topic) {
            case 'onstart' :
                $('#popup-info').text('Voice activation is now normally started');
                break;
            case 'onend' :
                $('#popup-info').text('Voice activation is now normally stopped');
                break;
            case 'onerror' :
                $('#popup-info').text('Voice activation stopped abnormally');
                break;
            case 'nothing' :
                $('#popup-info').text('Voice activation do not find any activation');
                break;
            case 'many' :
                $('#popup-info').text('Voice activation find many activations');
                break;
            }
            $('#popup-info').dialog('open');
        }
    }
        
    /*
     * initialisation of all general resources
     * 
     * @param initialisation
     */
    initialisation (initialisation) {
        this.control.initialisation(initialisation);
    }

    /*
     * termination of all general resources
     */
    termination () {
        this.control.termination();
    }

    /*
     * configuration of the voice activation scanning rules in html
     */
    config (activations) {
        this.control.config(activations);
    }

    /*
     * start the voice activation after all static configuration have done
     * on demand function can be called any time after configuration
     */
    start () {
        this.control.start();
    }

    /*
     * stop the voice activation after start to stop the activation
     * on demand function can be called any time after start
     */
    stop () {
        this.control.stop();
    }

    /*
     * private
     * return if the element is visible or not
     * @returns {number} ored with values
     *    0 : no
     *    1 : top
     *    2 : bottom
     *    4 : left
     *    8 : right
     *   16 : middle
     */
    elementPosition(el) {
        var rect     = el.getBoundingClientRect(),
            vWidth   = window.innerWidth || document.documentElement.clientWidth,
            vHeight  = window.innerHeight || document.documentElement.clientHeight;     

        let position = 0;
        if (rect.right < 0 || rect.bottom < 0 
                || rect.left > vWidth || rect.top > vHeight)
            return position;
        const THRESHOLD = 100;
        if (rect.top < THRESHOLD) position += 1;
        if (rect.bottom > vHeight - THRESHOLD) position += 2;
        if (rect.left < THRESHOLD) position += 4;
        if (rect.right > vWidth - THRESHOLD) position += 8;
        if (position === 0) position = 16;
        return position;
    }

    /*
     * private
     * return if the element is visible or not
     * @returns {string} name of the position of the balloo
     * according to the position of the element
     */
    balloonPosition(position) {
        switch (position) {
        case  0: return "";
        case  1: return "down";
        case  2: return "up";
        case  3: return "";
        case  4: return "right";
        case  5: return "down-right";
        case  6: return "up-right";
        case  7: return "";
        case  8: return "left";
        case  9: return "down-left";
        case 10: return "up-left";
        case 11: return "";
        case 12: return "";
        case 13: return "";
        case 14: return "";
        case 15: return "";
        case 16: return "";
        }
    }
    
    /*
     * private
     * find the best element to put a balloon 
     */
    findBestBalloonElement (element) {
        if (element.nodeName === null) return element;
        let nodeName = element.nodeName.toLowerCase();
        if (nodeName === "i") {
            return element.parentElement;
        }
        if (nodeName === "input") {
            let parent = element.parentElement;
            if (parent.nodeName.toLowerCase() === 'label') {
                return parent;
            }
            let label;
            label = parent.querySelector('label[for="'+element.id+'"]')
            if (label !== null) return label;
            label = parent.querySelector('label')
            if (label !== null) return label;
        }
        return element;
    }
    
    /*
     * private
     * compute balloons content
     */
    computeBalloons () {
        for (let activation of this.control.activations) {
            let balloon = this.findBestBalloonElement (activation.dom);
//            activation.balloon.setAttribute ("data-balloon-length", "medium");
            let position = this.balloonPosition(this.elementPosition(activation.dom));
            if (position === "") position = "up";
            balloon.setAttribute ("data-balloon-pos", position);
            let content = "";
            content += "\""+activation.verbs.join('|')+" "+activation.subjects.join('|')+" "+(activation.complements !== undefined ? activation.complements.join('|') : "")+"\"";
            content += (activation.action !== undefined ? activation.action : "click");
            if (activation.property !== undefined && activation.value !== undefined) {
                content += " "+activation.value+"=>"+activation.property;
            }
            balloon.setAttribute ("aria-label", content);
            balloon.insertAdjacentHTML ('beforeend', '<i class="va fas fa-microphone"></i>');
        }
    }

    /*
     * private
     * show microphone
     */
    showBalloons () {
        const elements = document.querySelectorAll("i.va");
        for (const element of elements) {
            element.style.display = "inline";
        }
    }
        
    /*
     * private
     * hide microphone
     */
    hideBalloons () {
        const elements = document.querySelectorAll("i.va");
        for (const element of elements) {
            element.style.display = "none";
        }
    }
        
    /*
     * public
     * open balloon tooltip over voice activations
     */
    openBalloons () {
        switch (this.balloonsState) {
        case 0:
            this.computeBalloons ();
            this.showBalloons ();
            break;
        case 1:
            break;
        case 2:
            this.showBalloons ();
            break;
        }
        this.balloonsState = 1;
    }

    /*
     * public
     * close balloon tooltip over voice activations
     */
    closeBalloons () {
        switch (this.balloonsState) {
        case 0:
            this.computeBalloons ();
            this.hideBalloons ();
            break;
        case 1:
            this.hideBalloons ();
            break;
        case 2:
            break;
        }
        this.balloonsState = 2;
    }

    /*
     * public
     * toggle balloon tooltip over voice activations
     */
    toggleBalloons () {
        switch (this.balloonsState) {
        case 0:
            this.computeBalloons ();
            this.showBalloons ();
            this.balloonsState = 1;
            break;
        case 1:
            this.hideBalloons ();
            this.balloonsState = 2;
            break;
        case 2:
            this.showBalloons ();
            this.balloonsState = 1;
            break;
        }
    }

    /*
     * private
     * build a debug tooltip about voice activations
     */
    buildDebug () {
        let debug = '';
        debug += '<div id="va-debug">'
        debug += '   <div> Error : <span class="va-debug-error"> </span> </div>'
        debug += '   <div> Phrase : <span class="va-debug-phrase"> </span> </div>'
        debug += '   <div> Verb : <span class="va-debug-verb"> </span> </div>'
        debug += '   <div> Subject : <span class="va-debug-subject"> </span> </div>'
        debug += '   <div> Complement : <span class="va-debug-complement"> </span> </div>'
        debug += '   <div> Selected # : <span class="va-debug-selected"> </span> </div>'
        debug += '   <div> Filtered # : <span class="va-debug-filtered"> </span> </div>'
        debug += '   <div> Action : <span class="va-debug-action"> </span> </div>'
        debug += '</div>';
        document.querySelector('body').insertAdjacentHTML('beforeend', debug);
        let dom = document.querySelector('#va-debug');
        dom.style['z-index']=200;
        dom.style.position='fixed';
        dom.style.width='300px';
        dom.style.background='#c0c0c0';
        dom.style.padding='10px';
        try {
            if (this.horizontal !== undefined) {
                const position = this.horizontal.split(':');
                dom.style[position[0]] = position[1];
            } else {
                dom.style.right='0px';
            }
        } catch (error) {
            dom.style.right='0px';
        }
        try {
            if (this.vertical !== undefined) {
                const position = this.vertical.split(':');
                dom.style[position[0]] = position[1];
            } else {
                dom.style.top='450px';
            }
        } catch (error) {
            dom.style.top='450px';
        }
    }

    /*
     * private
     * show a debug tooltip about voice activations
     */
    showDebug () {
        const debug = document.querySelector("#va-debug");
        if (debug === null) return;
        debug.style.display = "block";
    }

    /*
     * private
     * hide a debug tooltip about voice activations
     */
    hideDebug () {
        const debug = document.querySelector("#va-debug");
        if (debug === null) return;
        debug.style.display = "none";
    }

    /*
     * public
     * open debug tooltip about voice activations
     */
    openDebug () {
        switch (this.debugState) {
        case 0:
            this.buildDebug ();
            this.showDebug ();
            break;
        case 1:
            break;
        case 2:
            this.showDebug ();
            break;
        }
        this.debugState = 1;
    }

    /*
     * public
     * close debug tooltip about voice activations
     */
    closeDebug () {
        switch (this.debugState) {
        case 0:
            this.buildDebug ();
            this.hideDebug ();
            break;
        case 1:
            this.hideDebug ();
            break;
        case 2:
            break;
        }
        this.debugState = 2;
    }

    /*
     * public
     * toggle debug tooltip about voice activations
     */
    toggleDebug () {
        switch (this.debugState) {
        case 0:
            this.buildDebug ();
            this.showDebug ();
            this.debugState = 1;
            break;
        case 1:
            this.hideDebug ();
            this.debugState = 2;
            break;
        case 2:
            this.showDebug ();
            this.debugState = 1;
            break;
        }
    }

}
