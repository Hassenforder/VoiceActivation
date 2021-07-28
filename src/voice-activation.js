/*
 * set of classes to deal with a full activation of a HTML page
 * 
 */
const VoiceActivationControlVersion = "1.0";
/*
 * 
 * uniq Voice configuration object for a html page
 */
class VoiceConfiguration {

    /**
     * @param loop {boolean | null optional : allows to loop again until an error occurs
     * @param derived {boolean | null optional : allows to add conjugaison or declinaison
     * @param synonym {boolean | null optional : allows to add synonyms for verbs or nouns
     * @param lang {string} mandatory: initial language of the interface
     * @param i18n {string | null optional : allow to add translations for verbs or nouns
     * @param nothing {string} optional: behavior if no sentence is available after filtering
     *                                can be notify of any value to ignore
     * @param many {string} optional: behavior if many sentences are available after filtering
     *                                can be notify, apply or any value to ignore
     */
    
    constructor(loop, derived, synonym, lang, i18n, nothing, many) {
        this.loop = loop;
        this.derived = derived;
        this.synonym = synonym;
        this.lang = lang;
        this.i18n = i18n;
        this.nothing = nothing;
        this.many = many;
    }

}

/*
 * 
 * VoiceActivation represent one activation per element in a JTML page
 * we will have several VoiceActivation per element
 * to deal with different spelling and action
 * 
 */
class VoiceActivation {

    /**
     * @param dom {HTML} mandatory : the DOM objects to use
     * @param verb {string []} mandatory : spelled by user (sementic action to do)
     * @param subject {string []} mandatory : spelled by user (sementic noun for the target)
     * @param complement {string [] | null} optional : spelled by user give additional information
     * @param allways {boolean | null optional : if true the sentence is usable even if dom is hidden
     * @param action {string} optional : name of the action to execute on the DOM object
     * @param property {string} optional : name of a dom property to change
     * @param value {string} optional : value to apply to the property of the dom object
     */
    
    constructor(dom, verbs, subjects, complements, allways, action, property, value) {
		if (dom !== undefined && dom !== null) {
			this.dom = dom;
		} else {
			this.dom = undefined;
        }
		this.verbs = verbs;
        this.subjects = subjects;
        this.complements = complements;
        this.allways = allways;
        this.action = action;
        this.property = property;
        this.value = value;
    }

}

/*
 * 
 * main class to handle the voice activation of a HTML page
 */
class VoiceActivationControl {
/*
 * listener : function used to notify page about behaviour
 * configuration : VoiceConfiguration
 * activations : VoiceActivation []
 * actions : { string, function } []
 * conjugations : { string, string } []
 * translations : { string, string } []
 * derivations : { string, string } []
 * 
 * recognition
 * 
 */

    constructor (listener) {
        this.listener = listener;
    }

    /*
     * extract all voice activation scanning rules in html
     * @return {VoiceConfiguration} : a configuration object initialized using HTML
     */
    extractConfigurationFromHtml() {
        const element = document.getElementById("vai");
        if (element === null) return undefined;
        const loop = element.dataset.vaLoop;
        const derived = element.dataset.vaDerived;
        const synonym = element.dataset.vaSynonym;
        const i18n = element.dataset.vaI18n;
        const lang = element.dataset.vaLang;
        const nothing = element.dataset.vaNothing;
        const many = element.dataset.vaMany;
        const configuration = new VoiceConfiguration (
                loop === 'true', derived === 'true', synonym === 'true', lang, i18n, nothing, many
            );
        return configuration;
    }
    
    /*
     * register of kind of conjugations
     */
    registerConjugations (conjugations) {
        this.conjugations = {};
        this.conjugations['actualiser'] = 'actualise, actualisez';
        this.conjugations['afficher'] = 'affiche,affichez';
        this.conjugations['aller'] = 'va,allez';
        this.conjugations['cacher'] = 'cache,cachez';
        this.conjugations['chercher'] = 'cherche,cherchez';
        this.conjugations['cocher'] = 'coche,cochez';
        this.conjugations['colorier'] = 'colorie,coloriez';
        this.conjugations['connecter'] = 'connecte, connectez';
        this.conjugations['créer'] = 'crée,créez';
        this.conjugations['décocher'] = 'décoche,décochez';
        this.conjugations['démarrer'] = 'démarre,démarrez';
        this.conjugations['éditer'] = 'édite,éditez';
        this.conjugations['exporter'] = 'exporte,exportez';
        this.conjugations['faire'] = 'fait, fais';
        this.conjugations['fermer'] = 'ferme, fermez';
        this.conjugations['importer'] = 'importe, importez';
        this.conjugations['ouvrir'] = 'ouvre, ouvrez';
        this.conjugations['quitter'] = 'quitte,quittez';
        this.conjugations['remplir'] = 'rempli';
        this.conjugations['sélectionner'] = 'sélectionne,sélectionnez';
        this.conjugations['soumettre'] = 'soumet';
        this.conjugations['supprimer'] = 'supprime,supprimez';
        this.conjugations['stopper'] = 'stoppe, stoppez';
        if (conjugations === undefined) return;
    }

    /*
     * register of kind of declinations
     */
    registerDeclinations (declinations) {
        this.declinations = {};
        this.declinations['configuration'] = 'config';
        this.declinations['sign in'] = 'sign-in';
        this.declinations['sign out'] = 'sign-out';
        this.declinations['mot de passe'] = 'password';
        this.declinations['nom'] = 'non';
        this.declinations['un'] = 'a,à';
        this.declinations['deux'] = 'de';
        this.declinations['voix'] = 'voit, voie';
        this.declinations['champ'] = 'chant';
        if (declinations === undefined) return;
    }
    
    /*
     * register of kind of synonyms
     */
    registerSynonyms (synonyms) {
        this.synonyms = {};
        if (synonyms === undefined) return;
    }
    
    /*
     * register of kind of translations
     */
    registerTranslations (translations) {
        this.translations = {};
        if (translations === undefined) return;
    }
    
    /*
     * register of kind of actions
     */
    registerActions (actions) {
        this.actions = {};
        this.actions['click'] = function (activation, complement, bestComplementFunction) {
			activation.dom.click();
        };
        this.actions['check'] = function (activation, complement, bestComplementFunction) {
			if (activation.dom.type !== "checkbox" && activation.dom.type !== "radio") return;
			if (activation.dom.checked) return;
			// fire the click function on radio and checkbox if only not yet checked
			activation.dom.click();
        };
        this.actions['uncheck'] = function (activation, complement, bestComplementFunction) {
			if (activation.dom.type !== "checkbox" && activation.dom.type !== "radio") return;
			if (! activation.dom.checked) return;
			// fire the click function on radio and checkbox only if checked
			activation.dom.click();
        };
        this.actions['toggle'] = function (activation, complement, bestComplementFunction) {
			if (activation.dom.type !== "checkbox" && activation.dom.type !== "radio") return;
			// fire the click function on radio and checkbox so toggle the state
			activation.dom.click();
        };
        this.actions['select'] = function (activation, complement, bestComplementFunction) {
            if (activation.property === undefined) return;
			if (activation.property === 'value' && activation.value !== undefined && activation.dom.nodeName === "SELECT") {
				// for a select change its value according to the option value
				// computed during creation to avoid a link to the option
				activation.dom.value = activation.value;
			}
        };
        this.actions['style'] = function (activation, complement, bestComplementFunction) {
            if (activation.property === undefined) return;
			let value = bestComplementFunction (activation, complement);
			if (value !== undefined && value.length !== 0) {
				value = value.join('');
			}
			if (value !== undefined) {
				// hope property is a regular style entry value
				// hope value is a regular value for the chosen style
				activation.dom.style[activation.property] = value;
			}
        };
        this.actions['fill'] = function (activation, complement, bestComplementFunction) {
			let value = bestComplementFunction (activation, complement);
			if (value !== undefined && value.length !== 0) {
				value = value.join(' ');
			}
			if (value === undefined) return;
			if (activation.dom.nodeName === "INPUT") {
				// <input> element should have a value property
				activation.dom.value = value;
			} else {
				// <...> element change the text may be it is a good idea
				activation.dom.innerText = value;
			}
        };
        if (actions === undefined) return;
    }
    
    /*
     * initialisation of all general resources
     * 
     * @param configuration {VoiceConfiguration} optional : a programatic configuration object
     * initialisation : {
     *    configuration : VoiceConfiguration,
     *    conjugations : [ { 'infinitif' : 'conjuguations in csv' } ],
     *    declinations : [ { 'noun' : 'nouns in csv' } ],
     *    synonyms : [ { 'text' : 'texts in csv' } ],
     *    translations : [ { 'name' : 'names in csv' } ],
     *    actions : [ { 'token' : function(activation) {...} } ]
     * }
     */
    initialisation (initialisation) {
        this.configuration = new VoiceConfiguration (false, false, false, "en-US", "", 'error', 'error');
        if (initialisation !== undefined && initialisation.configuration !== undefined) {
            this.configuration = { ...this.configuration, ...initialisation.configuration };
        }
        this.configuration = { ...this.configuration, ...this.extractConfigurationFromHtml() };

        let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;
        let self = this;
        this.recognition.onresult = function (event) {
            self.process(event);
        };
        this.recognition.onstart = function (event) {
            // first for behavior on UI (skipped it is not an error
            // self.notify('error', 'onstart', '');
            // second to explain what happens
            self.notify('debug', 'error', 'onstart');
            // third to explain what happens
            self.notify('info', 'onstart', '');
        };
        this.recognition.onend = function (event) {
            if (! self.manual && self.configuration.loop) {
                setTimeout(function () {self.start();}, 300);
            }
            // first for behavior on UI
            self.notify('error', 'onend', '');
            // second to explain what happens
            self.notify('debug', 'error', 'onend');
            // third to explain what happens
            self.notify('info', 'onend', '');
        };
        this.recognition.onerror = function (event) {
            // first for behavior on UI
            self.notify('error', 'onerror', '');
            // second to explain what happens
            self.notify('debug', 'error', 'onerror');
            // third to explain what happens
            self.notify('info', 'onerror', '');
        };

        this.registerConjugations (initialisation !== undefined ? initialisation.conjugations : undefined);
        this.registerDeclinations (initialisation !== undefined ? initialisation.declinations : undefined);
        this.registerSynonyms (initialisation !== undefined ? initialisation.synonyms : undefined);
        this.registerTranslations (initialisation !== undefined ? initialisation.translations : undefined);
        this.registerActions (initialisation !== undefined ? initialisation.actions : undefined);
    }
    
    /*
     * termination of all general resources
     */
    termination () {
        
    }

    /*
     * private
     * notification of internal behavior
     * @param {string} level : in info, debug
     * @param {string} topic : the topic of the notification, explains thetext
     * @param {string or object} text : the text if a string or a structure with several fields
     * 
     */
    notify (level, topic, text) {
        if (this.listener === undefined) {
            console.error("Something wrong : ", level, topic, text);
        } else {
            this.listener (level, topic, text);
        }
    }
    
    /*
     * private
     * convert a comma separated of text into an array of trimmed text 
     */
    sanitizeWords (text) {
        const result = new Set();
        if (text === undefined) return result;
        const items = text.split(",");
        for (let item of items) {
            item = item.trim();
            if (item !== "") {
                result.add(item);
            }
        }
        return result;
    }
    
    /*
     * private
     * expand initial words set by a new set from a registry
     * can be used to add some synonymes, conjugations, etc.
     */
    expandWords(words, registry) {
        if (registry === undefined) return words;
        if (registry.length === 0) return words;
        let result = new Set();
        for (let word of words) {
            result.add(word);
            if (word in registry) {
                result = new Set([ ...result, ...this.sanitizeWords(registry[word])]);
            }
        }
        return result;
    }

    /*
     * private
     * expand a generic activation to a whole set of VoiceActivation
     */
    expandActivation(
                element, target,
                verbList, subjectList, complementList,
                derived, synonym, i18n,
                allways, action, property, value
            ) {
        // find the real dom element(s) for the rule
		// and put it in an array of dom objects
        let doms = [];
        if (target !== undefined) {
            // special querySelector to touch immediat parent
            if (target === '..') {
                doms.push(element.parentElement);
            } else {
                doms = Array.from(document.querySelectorAll(target));
            }
        } else {
			doms.push(element);
		}
        if (value !== undefined) {
            // special value to use the value attribute of the dom element
            if (value === './value') value = element.value;
        }
        // find the real list of spelled words
        let verbs = this.sanitizeWords(verbList);
        let subjects = this.sanitizeWords(subjectList);
        let complements = this.sanitizeWords(complementList);

        // if derived allows add conjugations or declinations
        if ((derived === undefined && this.configuration.derived) || derived) {
            verbs = this.expandWords (verbs, this.conjugations);
            subjects = this.expandWords (subjects, this.declinations);
            complements = this.expandWords (complements, this.declinations);
        }
        
        // if synonym allows add synonyms
        if ((synonym === undefined && this.configuration.synonym) || synonym) {
            verbs = this.expandWords (verbs, this.synonyms);
            subjects = this.expandWords (subjects, this.synonyms);
            complements = this.expandWords (complements, this.synonyms);
        }

        // and now feed the activations registry with all gathered words
		// one entry per doms entry if doms is like an array unwrap them
		// remove undefined and null entries as useless
		verbs = Array.from(verbs);
		subjects = Array.from(subjects);
		complements = Array.from(complements);
		for (const dom of doms) {
			if (dom === undefined) continue;
			if (dom === null) continue;
			const activation = new VoiceActivation (
					dom,
					verbs, subjects, complements,
					allways, action, property, value
			);
			this.activations.push(activation);
		}

        // if translation allows add translations
        // not yet implemented as we should create a brand new VoiceActivation
        // for each langage declared
    }
    
    /*
     * private
     * extract all voice activation by scanning html elements
     */
    extractActivationsFromHtml() {
        const elements = document.querySelectorAll("[data-va-verbs][data-va-subjects]");
        for (const element of elements) {
            const target = element.dataset.vaTarget;
            const verbList = element.dataset.vaVerbs;
            const subjectList = element.dataset.vaSubjects;
            const complementList = element.dataset.vaComplements;
            const derived = element.dataset.vaDerived;
            const synonyme = element.dataset.vaSynonyme;
            const i18n = element.dataset.vaI18n;
            const allways = element.dataset.vaAllways;
            const action = element.dataset.vaAction;
            const property = element.dataset.vaProperty;
            const value = element.dataset.vaValue;
            this.expandActivation(
                    element, target,
                    verbList, subjectList, complementList,
                    derived, synonyme, i18n,
                    allways, action, property, value
            );
        }
    }

    /*
     * private
     * extract all uniq verbs in voice activation registry
     */
    getVerbs() {
        let verbs = new Set();
        for (const activation of this.activations) {
            verbs = new Set ([...verbs, ...activation.verbs]);
        }
        return Array.from(verbs);
    }

    /*
     * private
     * extract all uniq subjects in voice activation registry
     */
    getSubjects() {
        let subjects = new Set();
        for (const activation of this.activations) {
            subjects = new Set ([...subjects, ...activation.subjects]);
        }
        return Array.from(subjects);
    }

    /*
     * private
     * extract all uniq complements in voice activation registry
     */
    getComplements() {
        let complements = new Set();
        for (const activation of this.activations) {
            if (activation.complements === undefined) continue;
            complements = new Set ([...complements, ...activation.complements]);
        }
        return Array.from(complements);
    }

    /*
     * private
     * configuration of the voice activation scanning rules in html
     */
    buildGrammar () {
        let verbs = "<verb> = "+this.getVerbs().join (' | ')+";";
        let subjects = "<subject> = "+this.getSubjects().join (' | ')+";";
        let complements = "<complement> = "+this.getComplements().join (' | ')+";";
        let GRAMMAR = undefined;
        if (complements.length === 0) {
            GRAMMAR = '#JSGF V1.0; grammar sentence; public <sentence> = <verb> <subject>; '+verbs+subjects;
        } else {
            GRAMMAR = '#JSGF V1.0; grammar sentence; public <sentence> = <verb> <subject> <complement> *; '+verbs+subjects+complements;
        }
        return GRAMMAR;
    }
    
    /*
     * configuration of the voice activation scanning rules in html
     */
    config (activations) {
        this.activations = [];
        if (activations !== undefined) {
            this.activations = activations;
        }
        this.extractActivationsFromHtml();
        const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
        let speechWordList = new SpeechGrammarList();
        speechWordList.addFromString(this.buildGrammar (), 1);
        this.recognition.grammars = speechWordList;
        this.recognition.lang = this.configuration.lang;
    }

    /*
     * start the voice activation after all static configuration have done
     * on demand function can be called any time after configuration
     */
    start () {
        this.manual = false;
        this.recognition.start();
    }

    /*
     * stop the voice activation after start to stop the activation
     * on demand function can be called any time after start
     */
    stop () {
        this.manual = true;
        this.recognition.stop();
    }

    /*
     * private
     * select best activations according to the verb, subject and complement
     * @returns VoiceSentence []
     */
    selectActivations (verb, subject, complement) {
        let selected = this.activations.filter(function (activation) {
            return activation.verbs.includes(verb) && activation.subjects.includes(subject);
        });
        return selected;
    }

    /*
     * private
     * return if the element is visible or not
     * @returns boolean
     */
    isElementVisible(el) {
        var rect = el.getBoundingClientRect();
		if (rect.width === 0) return false;
		if (rect.height === 0) return false;
		if (rect.top < 0) return false;
		if (rect.left < 0) return false;
		if (rect.bottom > (window.innerHeight || document.documentElement.clientHeight)) return false;
		if (rect.right > (window.innerWidth || document.documentElement.clientWidth)) return false;
		return true;
    }

    /*
     * private
     * according to the rules filter to remove hidden sentences
     * @returns VoiceSentence []
     */
    filterForbiddenActivations (activations) {
        let self = this;
        let filtered = activations.filter(function (activation) {
            // if allways is true the activation is ever true
            if (activation.allways !== undefined && activation.allways) {
                return true;
            }
			// no dom ... may be activation is not usable
			if (activation.dom === undefined) {
				return false;
			}
            // if hidden the activation is ever false
			if ( ! self.isElementVisible (activation.dom)) {
				return false;
            }
            // if disabled the activation is ever false
			if (activation.dom.disabled) {
				return false;
            }
			// seems we can use activation
			return true;
        });
        return filtered;
    }

    /*
     * private
     * tries to select the best complement according to the different sources
     *    first complement in the activation if not '*'
     *    complement in the spoken word
     *    value in the activation
     *    
     *    the result may be a single string or an array of string
     */
    bestComplement (activation, complement) {
        let value = undefined;
        if (activation.complements.length === 0) {
            value = complement;
        } else if (activation.complements.includes("*")) {
            if (complement === undefined) {
                value = activation.complements;
            } else {
                value = complement;
            }
        } else {
            value = activation.complements;
        }
        if (value === undefined) {
            value = activation.value;
        }
        return value;
    }

    /*
     * private
     * according to activations detected apply the action
     */
    applyActivation (activation, complement) {
        if (activation === undefined) return;
        let name = undefined;
        if (name === undefined) name = activation.action;
        if (name === undefined) name = "click";
        if (name === undefined) return;
        let action = this.actions[name];
        if (action === undefined) return;
        this.notify ('debug', 'action', name);
        try {
            action (activation, complement, this.bestComplement);
        } catch (error) {
            this.notify ('debug', 'action', 'exception in action');
        }
    }
    
    /*
     * private
     * decide what to do according to the size of sentences
     */
    decide (sentences, verb, subject, complement) {
        switch (sentences.length) {
        case 0 :
            if (this.configuration.nothing === 'notify') {
                let info = {
                    sentence : sentences,
                    verb : verb,
                    subject : subject,
                    complement : complement
                };
                this.notify ('info', 'nothing', info);
            }
            break;
        case 1 :
            this.applyActivation (sentences[0], complement);
            break;
        default :
            if (this.configuration.many === 'notify') {
                let info = {
                    sentence : sentences,
                    verb : verb,
                    subject : subject,
                    complement : complement
                };
                this.notify ('info', 'many', info);
            } else if (this.configuration.many === 'apply') {
                for (let filter of sentences) {
                    this.applyActivation (filter, complement);
                }
            }
            break;
        }
    }

    /*
     * private
     * find the spoken verb in the words array
     * trick may be the activation verb is composed by several word
     */
    findVerb (words) {
        for (let index = 0; index < words.length; index++) {
            let firstVerb = words[index];

            let selected = this.activations.filter(function (activation) {
                for (let verb of activation.verbs) {
                    if (verb.startsWith(firstVerb)) return true;
                }
                return false;
            });
            // continue the loop current word is not a known verb
            if (selected.length === 0) continue;

            // look if it is a composed verb
            let fullVerb = firstVerb;
            let extandedVerb = undefined;
            for (let index2 = index+1; index2 < words.length; index2++) {
                extandedVerb = fullVerb + " " + words[index2];
                let selected2 = selected.filter(function (activation) {
                    for (let verb of activation.verbs) {
                        if (verb.startsWith(extandedVerb)) return true;
                    }
                    return false;
                });
                if (selected2.length === 0) break;
                fullVerb = extandedVerb;
            }
            // composition stops fullVerb is the longuest verb we can build
            // checks if it is a perfect composition
            let selected3 = selected.filter(function (activation) {
                return activation.verbs.includes(fullVerb);
            });
            // not a perfect match check next words
            if (selected3.length === 0) continue;
            // best valid composition
            return fullVerb;
        }
        return undefined;
    }

    /*
     * private
     * find the spoken subject in the words array
     * trick may be the activation verb is composed by several word
     */
    findSubject (words) {
        for (let index = 0; index < words.length; index++) {
            let initialSubject = words[index];

            let selected = this.activations.filter(function (activation) {
                for (let subject of activation.subjects) {
                    if (subject.startsWith(initialSubject)) return true;
                }
                return false;
            });
            // continue the loop current word is not a known subject
            if (selected.length === 0) continue;

            // look if it is a composed subject
            let fullSubject = initialSubject;
            let extandedSubject = undefined;
            for (let index2 = index+1; index2 < words.length; index2++) {
                extandedSubject = fullSubject + " " + words[index2];
                let selected2 = selected.filter(function (activation) {
                    for (let subject of activation.subjects) {
                        if (subject.startsWith(extandedSubject)) return true;
                    }
                    return false;
                });
                if (selected2.length === 0) break;
                fullSubject = extandedSubject;
            }
            // composition stops fullSubject is the longuest subject we can build
            // checks if it is a perfect composition
            let selected3 = selected.filter(function (activation) {
                return activation.subjects.includes(fullSubject);
            });
            // nothing check next words
            if (selected3.length === 0) continue;
            // found with all parts
            return fullSubject;
        }
        return undefined;
    }
    
    /*
     * private
     * find the spoken complements in the words array
     */
    findComplements (words, verb, subject) {
        var remains = [];
        if (words === undefined) return remains;
        let verbs = verb !== undefined ? verb.split(' ') : [];
        let subjects = subject !== undefined ? subject.split(' ') : [];
        for (let word of words) {
            if (verbs.includes(word)) continue; // skip word in verbs
            if (subjects.includes(word)) continue; // skip word in subjects
            remains.push (word);
        }
        return remains;
    }

    /*
     * private
     * process a voice recognition from the recognition system
     */
    process (event) {
        try {
            this.notify ('debug', 'clear', '');
            // resultIndex is the last event
            // 0..resultIndex-1 are the previous event in case of contiguous
            const speech = event.results[event.resultIndex][0];
            const result = speech.transcript;
            this.notify ('info', 'phrase', result);
            this.notify ('debug', 'phrase', result);
            const words = result.toLowerCase().trim().split(" ");
            let verb = this.findVerb (words);
            this.notify ('debug', 'verb', verb);
            let subject = this.findSubject (words);
            this.notify ('debug', 'subject', subject);
            let complement = this.findComplements (words, verb, subject);
            this.notify ('debug', 'complement', complement);
            if (verb === undefined || subject === undefined) {
                if (this.configuration.nothing === 'notify') {
                    let info = {
                        sentence : result,
                        verb : verb,
                        subject : subject,
                        complement : complement
                    };
                    this.notify ('info', 'nothing', info);
                }
                return;
            }
            let selected = this.selectActivations (verb, subject, complement);
            this.notify ('debug', 'selected', selected.length);
            let filtered = this.filterForbiddenActivations (selected);
            this.notify ('debug', 'filtered', filtered.length);
            this.decide (filtered, verb, subject, complement);
        }
        catch (exception) {
            this.notify ('debug', 'error', 'catch an exception'+exception);
        }
    }
    
}
