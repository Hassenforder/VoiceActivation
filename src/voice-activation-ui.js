const VoiceActivationUIVersion = "1.0";
class VoiceActivationUI {
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
		const balloonsDOM = document.getElementById("activation-balloons");
		if (balloonsDOM !== null) {
			balloonsDOM.onclick = function (event) {
				if (event.target.checked) {
					self.openBalloons();
				} else {
					self.closeBalloons();
				}
			};
		};
		const debugDOM = document.getElementById("activation-debug");
		if (debugDOM !== null) {
			debugDOM.onclick = function (event) {
				if (event.target.checked) {
					self.openDebug();
				} else {
					self.closeDebug();
				}
			};
		};
		const startDOM = document.getElementById("activation-start");
		if (startDOM !== null) {
			startDOM.onclick = function (event) {
				self.start();
			};
		};
		const stopDOM = document.getElementById("activation-stop");
		if (stopDOM !== null) {
			stopDOM.onclick = function (event) {
				self.stop();
			};
		}
		const toggleDOM = document.getElementById("activation-toggle");
		if (toggleDOM !== null) {
			toggleDOM.onclick = function (event) {
				if (event.target.checked) {
					self.start();
				} else {
					self.stop();
				}
			}
		}
		const css = window.document.styleSheets[0];
		css.insertRule('.vab { padding: 2px; }', css.cssRules.length);
	}

    /*
     * private
     * just correct the toggle if it exist to reflect the down state of the activation
     */
    handle_error (topic, text) {
		const toggleDOM = document.getElementById("activation-toggle");
		if (toggleDOM !== null) {
			if (toggleDOM !== null && toggleDOM.checked) toggleDOM.click();
		}
	}

    /*
     * private
     * display a debug message in a popup somewhere if the popup exists and is opened
     */
    handle_debug (topic, text) {
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
     * display an info message somewhere
     *  if #activation-report exists use it any way
	 *  else create an entry activation-popup and animate it for 1s
     */
    handle_info (topic, text) {
		let content = undefined;
		switch (topic) {
		case 'phrase' :
			break;
		case 'onstart' :
			content = 'Voice activation is now normally started';
			break;
		case 'onend' :
			content = 'Voice activation is now normally stopped';
			break;
		case 'onerror' :
			content = 'Voice activation stopped abnormally';
			break;
		case 'nothing' :
			content = 'Voice activation do not find any activation';
			break;
		case 'many' :
			content = 'Voice activation find too many activations';
			break;
		}
		if (content === undefined) return;
		// if page provide a report div use it
		let report = document.getElementById("activation-report");
		if (report !== null) {
			report.innerText = content;
			return;
		}
		// lookup for a previously created toast
		let info = document.getElementById("activation-toast");
		if (info === null) {
			// create one tiny bootstrap toast
			var toast  = '<div id="activation-toast" class="toast position-absolute top-0 start-50 translate-middle-x" role="alert" data-bs-delay="1500" >';
			    toast += ' <div class="d-flex">';
			    toast += '	<div class="toast-body"> </div>';
			    toast += ' </div>';
			    toast += '</div>';
			document.querySelector('body').insertAdjacentHTML('beforeend', toast);
			info = document.getElementById("activation-toast");
		}
		info.querySelector('.toast-body').innerText = content;
		bootstrap.Toast.getOrCreateInstance(info).show();
	}

    /*
     * private
     * handler of notifications from VoiceActivationControl
     * 
     * @param initialisation
     */
    handler (level, topic, text) {
        switch(level) {
		case 'error' : this.handle_error (topic, text); break;
        case 'debug' : this.handle_debug (topic, text); break;
        case 'info' : this.handle_info (topic, text); break;
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
			balloon.setAttribute ("data-balloon-break", "");
			let position = this.balloonPosition(this.elementPosition(activation.dom));
			if (position === "") position = "up";
			balloon.setAttribute ("data-balloon-pos", position);
			let content = balloon.getAttribute ("aria-label");
			if (content === null) content="";
			else content+="\n";
			content += "'";
			content += activation.verbs[0];
			if (activation.verbs.length > 1) {
				content += "..";
			}
			content += " ";
			content += activation.subjects[0];
			if (activation.subjects.length > 1) {
				content += "..";
			}
			content += " ";
			switch(activation.complements.length) {
			case 0: break;
			case 1: content += activation.complements[0]; break;
			default: content += activation.complements[0]; content += "|..."; break;
			}
			content += "'";
			content += " (";
			content += (activation.action !== undefined ? activation.action : "click");
			if (activation.property !== undefined) {
				content += " ";
				content += activation.property;
			}
			if (activation.value !== undefined) {
				content += "="+activation.value;
			}
			content += ")";
			balloon.setAttribute ("aria-label", content);
			if (balloon.querySelector('.vab') === null) {
				balloon.insertAdjacentHTML ('beforeend', '<i class="vab fas fa-microphone"></i>');
			}
		}
	}
	
    /*
     * private
     * show microphone
     */
    showBalloons () {
        const elements = document.querySelectorAll("i.vab");
        for (const element of elements) {
            element.style.display = "inline";
        }
    }
        
    /*
     * private
     * hide microphone
     */
    hideBalloons () {
        const elements = document.querySelectorAll("i.vab");
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
        let content = '';
        content += '<div id="va-debug">'
        content += '   <div> Error : <span class="va-debug-error"> </span> </div>'
        content += '   <div> Phrase : <span class="va-debug-phrase"> </span> </div>'
        content += '   <div> Verb : <span class="va-debug-verb"> </span> </div>'
        content += '   <div> Subject : <span class="va-debug-subject"> </span> </div>'
        content += '   <div> Complement : <span class="va-debug-complement"> </span> </div>'
        content += '   <div> Selected # : <span class="va-debug-selected"> </span> </div>'
        content += '   <div> Filtered # : <span class="va-debug-filtered"> </span> </div>'
        content += '   <div> Action : <span class="va-debug-action"> </span> </div>'
        content += '</div>';
        document.querySelector('body').insertAdjacentHTML('beforeend', content);
        let debug = document.querySelector('#va-debug');
        debug.style['z-index']=200;
        debug.style.position='fixed';
        debug.style.width='300px';
        debug.style.background='#c0c0c0';
        debug.style.padding='10px';
        try {
            if (this.horizontal !== undefined) {
                const position = this.horizontal.split(':');
                debug.style[position[0]] = position[1];
            } else {
                debug.style.right='0px';
            }
        } catch (error) {
            debug.style.right='0px';
        }
        try {
            if (this.vertical !== undefined) {
                const position = this.vertical.split(':');
                debug.style[position[0]] = position[1];
            } else {
                debug.style.top='450px';
            }
        } catch (error) {
            debug.style.top='450px';
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
