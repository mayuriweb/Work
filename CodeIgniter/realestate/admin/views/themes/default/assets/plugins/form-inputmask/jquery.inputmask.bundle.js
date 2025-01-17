date/**
* @license Input Mask plugin for jquery
* http://github.com/RobinHerbots/jquery.inputmask
* Copyright (c) 2010 - 2013 Robin Herbots
* Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
* Version: 2.3.17
*/

(function ($) {
    if ($.fn.inputmask == undefined) {
        $.inputmask = {
            //options default
            defaults: {
                placeholder: "_",
                optionalmarker: {
                    start: "[",
                    end: "]"
                },
                escapeChar: "\\",
                mask: null,
                oncomplete: $.noop, //executes when the mask is complete
                onincomplete: $.noop, //executes when the mask is incomplete and focus is lost
                oncleared: $.noop, //executes when the mask is cleared
                repeat: 0, //repetitions of the mask: * ~ forever, otherwise specify an integer
                greedy: true, //true: allocated buffer for the mask and repetitions - false: allocate only if needed
                autoUnmask: false, //automatically unmask when retrieving the value with $.fn.val or value if the browser supports __lookupGetter__ or getOwnPropertyDescriptor
                clearMaskOnLostFocus: true,
                insertMode: true, //insert the input or overwrite the input
                clearIncomplete: false, //clear the incomplete input on blur
                aliases: {}, //aliases definitions => see jquery.inputmask.extensions.js
                onKeyUp: $.noop, //override to implement autocomplete on certain keys for example
                onKeyDown: $.noop, //override to implement autocomplete on certain keys for example
                showMaskOnFocus: true, //show the mask-placeholder when the input has focus
                showMaskOnHover: true, //show the mask-placeholder when hovering the empty input
                onKeyValidation: $.noop, //executes on every key-press with the result of isValid. Params: result, opts
                skipOptionalPartCharacter: " ", //a character which can be used to skip an optional part of a mask
                showTooltip: false, //show the activemask as tooltip
                numericInput: false, //numericInput input direction style (input shifts to the left while holding the caret position)
                //numeric basic properties
                isNumeric: false, //enable numeric features
                radixPoint: "", //".", // | ","
                skipRadixDance: false, //disable radixpoint caret positioning
                rightAlignNumerics: true, //align numerics to the right
                //numeric basic properties
                definitions: {
                    '9': {
                        validator: "[0-9]",
                        cardinality: 1
                    },
                    'a': {
                        validator: "[A-Za-z\u0410-\u044F\u0401\u0451]",
                        cardinality: 1
                    },
                    '*': {
                        validator: "[A-Za-z\u0410-\u044F\u0401\u04510-9]",
                        cardinality: 1
                    }
                },
                keyCode: {
                    ALT: 18, BACKSPACE: 8, CAPS_LOCK: 20, COMMA: 188, COMMAND: 91, COMMAND_LEFT: 91, COMMAND_RIGHT: 93, CONTROL: 17, DELETE: 46, DOWN: 40, END: 35, ENTER: 13, ESCAPE: 27, HOME: 36, INSERT: 45, LEFT: 37, MENU: 93, NUMPAD_ADD: 107, NUMPAD_DECIMAL: 110, NUMPAD_DIVIDE: 111, NUMPAD_ENTER: 108,
                    NUMPAD_MULTIPLY: 106, NUMPAD_SUBTRACT: 109, PAGE_DOWN: 34, PAGE_UP: 33, PERIOD: 190, RIGHT: 39, SHIFT: 16, SPACE: 32, TAB: 9, UP: 38, WINDOWS: 91
                },
                //specify keycodes which should not be considered in the keypress event, otherwise the preventDefault will stop their default behavior especially in FF
                ignorables: [9, 13, 19, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 93, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123],
                getMaskLength: function (buffer, greedy, repeat, currentBuffer, opts) {
                    var calculatedLength = buffer.length;
                    if (!greedy) {
                        if (repeat == "*") {
                            calculatedLength = currentBuffer.length + 1;
                        } else if (repeat > 1) {
                            calculatedLength += (buffer.length * (repeat - 1));
                        }
                    }
                    return calculatedLength;
                }
            },
            val: $.fn.val, //store the original jquery val function
            escapeRegex: function (str) {
                var specials = ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'];
                return str.replace(new RegExp('(\\' + specials.join('|\\') + ')', 'gim'), '\\$1');
            }
        };

        $.fn.inputmask = function (fn, options) {
            var opts = $.extend(true, {}, $.inputmask.defaults, options),
                msie10 = /*@cc_on!@*/false,
                iphone = navigator.userAgent.match(new RegExp("iphone", "i")) !== null,
                android = navigator.userAgent.match(new RegExp("android.*safari.*", "i")) !== null,
                pasteEvent = isInputEventSupported('paste') && !msie10 ? 'paste' : 'input',
                android53x,
                masksets,
                activeMasksetIndex = 0;

            if (android) {
                var browser = navigator.userAgent.match(/safari.*/i),
                    version = parseInt(new RegExp(/[0-9]+/).exec(browser));
                android53x = (version <= 537);
                //android534 = (533 < version) && (version <= 534);
            }
            if (typeof fn === "string") {
                switch (fn) {
                    case "mask":
                        //resolve possible aliases given by options
                        resolveAlias(opts.alias, options);
                        masksets = generateMaskSets();

                        return this.each(function () {
                            maskScope($.extend(true, {}, masksets), 0).mask(this);
                        });
                    case "unmaskedvalue":
                        var $input = $(this), input = this;
                        if ($input.data('_inputmask')) {
                            masksets = $input.data('_inputmask')['masksets'];
                            activeMasksetIndex = $input.data('_inputmask')['activeMasksetIndex'];
                            opts = $input.data('_inputmask')['opts'];
                            return maskScope(masksets, activeMasksetIndex).unmaskedvalue($input);
                        } else return $input.val();
                    case "remove":
                        return this.each(function () {
                            var $input = $(this), input = this;
                            if ($input.data('_inputmask')) {
                                masksets = $input.data('_inputmask')['masksets'];
                                activeMasksetIndex = $input.data('_inputmask')['activeMasksetIndex'];
                                opts = $input.data('_inputmask')['opts'];
                                //writeout the unmaskedvalue
                                input._valueSet(maskScope(masksets, activeMasksetIndex).unmaskedvalue($input, true));
                                //clear data
                                $input.removeData('_inputmask');
                                //unbind all events
                                $input.unbind(".inputmask");
                                $input.removeClass('focus.inputmask');
                                //restore the value property
                                var valueProperty;
                                if (Object.getOwnPropertyDescriptor)
                                    valueProperty = Object.getOwnPropertyDescriptor(input, "value");
                                if (valueProperty && valueProperty.get) {
                                    if (input._valueGet) {
                                        Object.defineProperty(input, "value", {
                                            get: input._valueGet,
                                            set: input._valueSet
                                        });
                                    }
                                } else if (document.__lookupGetter__ && input.__lookupGetter__("value")) {
                                    if (input._valueGet) {
                                        input.__defineGetter__("value", input._valueGet);
                                        input.__defineSetter__("value", input._valueSet);
                                    }
                                }
                                try { //try catch needed for IE7 as it does not supports deleting fns
                                    delete input._valueGet;
                                    delete input._valueSet;
                                } catch (e) {
                                    input._valueGet = undefined;
                                    input._valueSet = undefined;

                                }
                            }
                        });
                        break;
                    case "getemptymask": //return the default (empty) mask value, usefull for setting the default value in validation
                        if (this.data('_inputmask')) {
                            masksets = this.data('_inputmask')['masksets'];
                            activeMasksetIndex = this.data('_inputmask')['activeMasksetIndex'];
                            return masksets[activeMasksetIndex]['_buffer'].join('');
                        }
                        else return "";
                    case "hasMaskedValue": //check wheter the returned value is masked or not; currently only works reliable when using jquery.val fn to retrieve the value 
                        return this.data('_inputmask') ? !this.data('_inputmask')['opts'].autoUnmask : false;
                    case "isComplete":
                        masksets = this.data('_inputmask')['masksets'];
                        activeMasksetIndex = this.data('_inputmask')['activeMasksetIndex'];
                        opts = this.data('_inputmask')['opts'];
                        return maskScope(masksets, activeMasksetIndex).isComplete(this[0]._valueGet().split(''));
                    default:
                        //check if the fn is an alias
                        if (!resolveAlias(fn, options)) {
                            //maybe fn is a mask so we try
                            //set mask
                            opts.mask = fn;
                        }
                        masksets = generateMaskSets();

                        return this.each(function () {
                            maskScope($.extend(true, {}, masksets), activeMasksetIndex).mask(this);
                        });

                        break;
                }
            } else if (typeof fn == "object") {
                opts = $.extend(true, {}, $.inputmask.defaults, fn);

                resolveAlias(opts.alias, fn); //resolve aliases
                masksets = generateMaskSets();

                return this.each(function () {
                    maskScope($.extend(true, {}, masksets), activeMasksetIndex).mask(this);
                });
            } else if (fn == undefined) {
                //look for data-inputmask atribute - the attribute should only contain optipns
                return this.each(function () {
                    var attrOptions = $(this).attr("data-inputmask");
                    if (attrOptions && attrOptions != "") {
                        try {
                            attrOptions = attrOptions.replace(new RegExp("'", "g"), '"');
                            var dataoptions = $.parseJSON("{" + attrOptions + "}");
                            $.extend(true, dataoptions, options);
                            opts = $.extend(true, {}, $.inputmask.defaults, dataoptions);
                            resolveAlias(opts.alias, dataoptions);
                            opts.alias = undefined;
                            $(this).inputmask(opts);
                        } catch (ex) { } //need a more relax parseJSON
                    }
                });
            }

            //helper functions
            function isInputEventSupported(eventName) {
                var el = document.createElement('input'),
		        eventName = 'on' + eventName,
		        isSupported = (eventName in el);
                if (!isSupported) {
                    el.setAttribute(eventName, 'return;');
                    isSupported = typeof el[eventName] == 'function';
                }
                el = null;
                return isSupported;
            }
            function resolveAlias(aliasStr, options) {
                var aliasDefinition = opts.aliases[aliasStr];
                if (aliasDefinition) {
                    if (aliasDefinition.alias) resolveAlias(aliasDefinition.alias); //alias is another alias
                    $.extend(true, opts, aliasDefinition);  //merge alias definition in the options
                    $.extend(true, opts, options);  //reapply extra given options
                    return true;
                }
                return false;
            }
            function getMaskTemplate(mask) {
                var escaped = false, outCount = 0, greedy = opts.greedy, repeat = opts.repeat;
                if (repeat == "*") greedy = false;
                if (mask.length == 1 && greedy == false) { opts.placeholder = ""; } //hide placeholder with single non-greedy mask
                var singleMask = $.map(mask.split(""), function (element, index) {
                    var outElem = [];
                    if (element == opts.escapeChar) {
                        escaped = true;
                    }
                    else if ((element != opts.optionalmarker.start && element != opts.optionalmarker.end) || escaped) {
                        var maskdef = opts.definitions[element];
                        if (maskdef && !escaped) {
                            for (var i = 0; i < maskdef.cardinality; i++) {
                                outElem.push(getPlaceHolder(outCount + i));
                            }
                        } else {
                            outElem.push(element);
                            escaped = false;
                        }
                        outCount += outElem.length;
                        return outElem;
                    }
                });

                //allocate repetitions
                var repeatedMask = singleMask.slice();
                for (var i = 1; i < repeat && greedy; i++) {
                    repeatedMask = repeatedMask.concat(singleMask.slice());
                }

                return { "mask": repeatedMask, "repeat": repeat, "greedy": greedy };
            }
            //test definition => {fn: RegExp/function, cardinality: int, optionality: bool, newBlockMarker: bool, offset: int, casing: null/upper/lower, def: definitionSymbol}
            function getTestingChain(mask) {
                var isOptional = false, escaped = false;
                var newBlockMarker = false; //indicates wheter the begin/ending of a block should be indicated

                return $.map(mask.split(""), function (element, index) {
                    var outElem = [];

                    if (element == opts.escapeChar) {
                        escaped = true;
                    } else if (element == opts.optionalmarker.start && !escaped) {
                        isOptional = true;
                        newBlockMarker = true;
                    }
                    else if (element == opts.optionalmarker.end && !escaped) {
                        isOptional = false;
                        newBlockMarker = true;
                    }
                    else {
                        var maskdef = opts.definitions[element];
                        if (maskdef && !escaped) {
                            var prevalidators = maskdef["prevalidator"], prevalidatorsL = prevalidators ? prevalidators.length : 0;
                            for (var i = 1; i < maskdef.cardinality; i++) {
                                var prevalidator = prevalidatorsL >= i ? prevalidators[i - 1] : [], validator = prevalidator["validator"], cardinality = prevalidator["cardinality"];
                                outElem.push({ fn: validator ? typeof validator == 'string' ? new RegExp(validator) : new function () { this.test = validator; } : new RegExp("."), cardinality: cardinality ? cardinality : 1, optionality: isOptional, newBlockMarker: isOptional == true ? newBlockMarker : false, offset: 0, casing: maskdef["casing"], def: maskdef["definitionSymbol"] | element });
                                if (isOptional == true) //reset newBlockMarker
                                    newBlockMarker = false;
                            }
                            outElem.push({ fn: maskdef.validator ? typeof maskdef.validator == 'string' ? new RegExp(maskdef.validator) : new function () { this.test = maskdef.validator; } : new RegExp("."), cardinality: maskdef.cardinality, optionality: isOptional, newBlockMarker: newBlockMarker, offset: 0, casing: maskdef["casing"], def: maskdef["definitionSymbol"] | element });
                        } else {
                            outElem.push({ fn: null, cardinality: 0, optionality: isOptional, newBlockMarker: newBlockMarker, offset: 0, casing: null, def: element });
                            escaped = false;
                        }
                        //reset newBlockMarker
                        newBlockMarker = false;
                        return outElem;
                    }
                });
            }
            function generateMaskSets() {
                var ms = [];
                var genmasks = []; //used to keep track of the masks that where processed, to avoid duplicates
                function markOptional(maskPart) { //needed for the clearOptionalTail functionality
                    return opts.optionalmarker.start + maskPart + opts.optionalmarker.end;
                }
                function splitFirstOptionalEndPart(maskPart) {
                    var optionalStartMarkers = 0, optionalEndMarkers = 0, mpl = maskPart.length;
                    for (i = 0; i < mpl; i++) {
                        if (maskPart.charAt(i) == opts.optionalmarker.start) {
                            optionalStartMarkers++;
                        }
                        if (maskPart.charAt(i) == opts.optionalmarker.end) {
                            optionalEndMarkers++;
                        }
                        if (optionalStartMarkers > 0 && optionalStartMarkers == optionalEndMarkers)
                            break;
                    }
                    var maskParts = [maskPart.substring(0, i)];
                    if (i < mpl) {
                        maskParts.push(maskPart.substring(i + 1, mpl));
                    }
                    return maskParts;
                }
                function splitFirstOptionalStartPart(maskPart) {
                    var mpl = maskPart.length;
                    for (i = 0; i < mpl; i++) {
                        if (maskPart.charAt(i) == opts.optionalmarker.start) {
                            break;
                        }
                    }
                    var maskParts = [maskPart.substring(0, i)];
                    if (i < mpl) {
                        maskParts.push(maskPart.substring(i + 1, mpl));
                    }
                    return maskParts;
                }
                function generateMask(maskPrefix, maskPart) {
                    var maskParts = splitFirstOptionalEndPart(maskPart);
                    var newMask, maskTemplate;

                    var masks = splitFirstOptionalStartPart(maskParts[0]);
                    if (masks.length > 1) {
                        newMask = maskPrefix + masks[0] + markOptional(masks[1]) + (maskParts.length > 1 ? maskParts[1] : "");
                        if ($.inArray(newMask, genmasks) == -1) {
                            genmasks.push(newMask);
                            maskTemplate = getMaskTemplate(newMask);
                            ms.push({
                                "mask": newMask,
                                "_buffer": maskTemplate["mask"],
                                "buffer": maskTemplate["mask"].slice(),
                                "tests": getTestingChain(newMask),
                                "lastValidPosition": undefined,
                                "greedy": maskTemplate["greedy"],
                                "repeat": maskTemplate["repeat"]
                            });
                        }
                        newMask = maskPrefix + masks[0] + (maskParts.length > 1 ? maskParts[1] : "");
                        if ($.inArray(newMask, genmasks) == -1) {
                            genmasks.push(newMask);
                            maskTemplate = getMaskTemplate(newMask);
                            ms.push({
                                "mask": newMask,
                                "_buffer": maskTemplate["mask"],
                                "buffer": maskTemplate["mask"].slice(),
                                "tests": getTestingChain(newMask),
                                "lastValidPosition": undefined,
                                "greedy": maskTemplate["greedy"],
                                "repeat": maskTemplate["repeat"]
                            });
                        }
                        if (splitFirstOptionalStartPart(masks[1]).length > 1) { //optional contains another optional
                            generateMask(maskPrefix + masks[0], masks[1] + maskParts[1]);
                        }
                        if (maskParts.length > 1 && splitFirstOptionalStartPart(maskParts[1]).length > 1) {
                            generateMask(maskPrefix + masks[0] + markOptional(masks[1]), maskParts[1]);
                            generateMask(maskPrefix + masks[0], maskParts[1]);
                        }
                    }
                    else {
                        newMask = maskPrefix + maskParts;
                        if ($.inArray(newMask, genmasks) == -1) {
                            genmasks.push(newMask);
                            maskTemplate = getMaskTemplate(newMask);
                            ms.push({
                                "mask": newMask,
                                "_buffer": maskTemplate["mask"],
                                "buffer": maskTemplate["mask"].slice(),
                                "tests": getTestingChain(newMask),
                                "lastValidPosition": undefined,
                                "greedy": maskTemplate["greedy"],
                                "repeat": maskTemplate["repeat"]
                            });
                        }
                    }

                }
                if ($.isArray(opts.mask)) {
                    $.each(opts.mask, function (ndx, lmnt) {
                        generateMask("", lmnt.toString());
                    });
                } else generateMask("", opts.mask.toString());

                return opts.greedy ? ms : ms.sort(function (a, b) { return a["mask"].length - b["mask"].length; });
            }
            function getPlaceHolder(pos) {
                return opts.placeholder.charAt(pos % opts.placeholder.length);
            }

            function maskScope(masksets, activeMasksetIndex) {
                var isRTL = false;
                //maskset helperfunctions

                function getActiveMaskSet() {
                    return masksets[activeMasksetIndex];
                }

                function getActiveTests() {
                    return getActiveMaskSet()['tests'];
                }

                function getActiveBufferTemplate() {
                    return getActiveMaskSet()['_buffer'];
                }

                function getActiveBuffer() {
                    return getActiveMaskSet()['buffer'];
                }

                function isValid(pos, c, strict) { //strict true ~ no correction or autofill
                    strict = strict === true; //always set a value to strict to prevent possible strange behavior in the extensions 

                    function _isValid(position, activeMaskset) {
                        var testPos = determineTestPosition(position), loopend = c ? 1 : 0, chrs = '', buffer = activeMaskset["buffer"];
                        for (var i = activeMaskset['tests'][testPos].cardinality; i > loopend; i--) {
                            chrs += getBufferElement(buffer, testPos - (i - 1));
                        }

                        if (c) {
                            chrs += c;
                        }

                        //return is false or a json object => { pos: ??, c: ??} or true
                        return activeMaskset['tests'][testPos].fn != null ? activeMaskset['tests'][testPos].fn.test(chrs, buffer, position, strict, opts) : false;
                    }

                    if (strict) {
                        var result = _isValid(pos, getActiveMaskSet()); //only check validity in current mask when validating strict
                        if (result === true) {
                            result = { "pos": pos }; //always take a possible corrected maskposition into account
                        }
                        return result;
                    }

                    var results = [], result = false, currentActiveMasksetIndex = activeMasksetIndex;
                    $.each(masksets, function (index, value) {
                        if (typeof (value) == "object") {
                            activeMasksetIndex = index;

                            var maskPos = pos;
                            if (currentActiveMasksetIndex != activeMasksetIndex && !isMask(pos)) {
                                if (c == getActiveBufferTemplate()[maskPos] || c == opts.skipOptionalPartCharacter) { //match non-mask item
                                    results.push({ "activeMasksetIndex": index, "result": { "refresh": true, c: getActiveBufferTemplate()[maskPos] } }); //new command hack only rewrite buffer
                                    getActiveMaskSet()['lastValidPosition'] = maskPos;
                                    return false;
                                } else {
                                    if (masksets[currentActiveMasksetIndex]["lastValidPosition"] >= maskPos)
                                        getActiveMaskSet()['lastValidPosition'] = -1; //mark mask as validated and invalid
                                    else maskPos = seekNext(pos);
                                }

                            }
                            if ((getActiveMaskSet()['lastValidPosition'] == undefined
                                    && maskPos == seekNext(-1)
                            )
                                || getActiveMaskSet()['lastValidPosition'] >= seekPrevious(maskPos)) {
                                if (maskPos >= 0 && maskPos < getMaskLength()) {
                                    result = _isValid(maskPos, getActiveMaskSet());
                                    if (result !== false) {
                                        if (result === true) {
                                            result = { "pos": maskPos }; //always take a possible corrected maskposition into account
                                        }
                                        var newValidPosition = result.pos || maskPos;
                                        if (getActiveMaskSet()['lastValidPosition'] == undefined ||
                                            getActiveMaskSet()['lastValidPosition'] < newValidPosition)
                                            getActiveMaskSet()['lastValidPosition'] = newValidPosition; //set new position from isValid
                                    }
                                    results.push({ "activeMasksetIndex": index, "result": result });
                                }
                            }
                        }
                    });
                    activeMasksetIndex = currentActiveMasksetIndex; //reset activeMasksetIndex

                    return results; //return results of the multiple mask validations
                }

                function determineActiveMasksetIndex() {
                    var currentMasksetIndex = activeMasksetIndex,
                        highestValid = { "activeMasksetIndex": 0, "lastValidPosition": -1 };
                    $.each(masksets, function (index, value) {
                        if (typeof (value) == "object") {
                            var activeMaskset = this;
                            if (activeMaskset['lastValidPosition'] != undefined) {
                                if (activeMaskset['lastValidPosition'] > highestValid['lastValidPosition']) {
                                    highestValid["activeMasksetIndex"] = index;
                                    highestValid["lastValidPosition"] = activeMaskset['lastValidPosition'];
                                }
                            }
                        }
                    });
                    activeMasksetIndex = highestValid["activeMasksetIndex"];
                    if (currentMasksetIndex != activeMasksetIndex) {
                        clearBuffer(getActiveBuffer(), seekNext(highestValid["lastValidPosition"]), getMaskLength());
                        getActiveMaskSet()["writeOutBuffer"] = true;
                    }
                }

                function isMask(pos) {
                    var testPos = determineTestPosition(pos);
                    var test = getActiveTests()[testPos];

                    return test != undefined ? test.fn : false;
                }

                function determineTestPosition(pos) {
                    return pos % getActiveTests().length;
                }



                function getMaskLength() {
                    return opts.getMaskLength(getActiveBufferTemplate(), getActiveMaskSet()['greedy'], getActiveMaskSet()['repeat'], getActiveBuffer(), opts);
                }

                //pos: from position

                function seekNext(pos) {
                    var maskL = getMaskLength();
                    if (pos >= maskL) return maskL;
                    var position = pos;
                    while (++position < maskL && !isMask(position)) {
                    }
                    ;
                    return position;
                }

                //pos: from position

                function seekPrevious(pos) {
                    var position = pos;
                    if (position <= 0) return 0;

                    while (--position > 0 && !isMask(position)) {
                    }
                    ;
                    return position;
                }

                function setBufferElement(buffer, position, element, autoPrepare) {
                    if (autoPrepare) position = prepareBuffer(buffer, position);

                    var test = getActiveTests()[determineTestPosition(position)];
                    var elem = element;
                    if (elem != undefined) {
                        switch (test.casing) {
                            case "upper":
                                elem = element.toUpperCase();
                                break;
                            case "lower":
                                elem = element.toLowerCase();
                                break;
                        }
                    }

                    buffer[position] = elem;
                }

                function getBufferElement(buffer, position, autoPrepare) {
                    if (autoPrepare) position = prepareBuffer(buffer, position);
                    return buffer[position];
                }

                //needed to handle the non-greedy mask repetitions

                function prepareBuffer(buffer, position) {
                    var j;
                    while (buffer[position] == undefined && buffer.length < getMaskLength()) {
                        j = 0;
                        while (getActiveBufferTemplate()[j] !== undefined) { //add a new buffer
                            buffer.push(getActiveBufferTemplate()[j++]);
                        }
                    }

                    return position;
                }

                function writeBuffer(input, buffer, caretPos) {
                    input._valueSet(buffer.join(''));
                    if (caretPos != undefined) {
                        caret(input, caretPos);
                    }
                }

                ;

                function clearBuffer(buffer, start, end) {
                    for (var i = start, maskL = getMaskLength() ; i < end && i < maskL; i++) {
                        setBufferElement(buffer, i, getBufferElement(getActiveBufferTemplate().slice(), i, true));
                    }
                }

                ;

                function setReTargetPlaceHolder(buffer, pos) {
                    var testPos = determineTestPosition(pos);
                    setBufferElement(buffer, pos, getBufferElement(getActiveBufferTemplate(), testPos));
                }

                function checkVal(input, writeOut, strict, nptvl) {
                    var inputValue = nptvl != undefined ? nptvl.slice() : truncateInput(input._valueGet()).split('');

                    $.each(masksets, function (ndx, ms) {
                        if (typeof (ms) == "object") {
                            ms["buffer"] = ms["_buffer"].slice();
                            ms["lastValidPosition"] = undefined;
                            ms["p"] = 0;
                        }
                    });
                    if (strict !== true) activeMasksetIndex = 0;
                    if (writeOut) input._valueSet(""); //initial clear

                    var ml = getMaskLength();
                    $.each(inputValue, function (ndx, charCode) {
                        var index = ndx,
                            lvp = getActiveMaskSet()["lastValidPosition"],
                            pos = getActiveMaskSet()["p"];

                        pos = lvp == undefined ? index : pos;
                        lvp = lvp == undefined ? -1 : lvp;

                        if ((strict && isMask(index)) ||
                            ((charCode != getBufferElement(getActiveBufferTemplate().slice(), index, true) || isMask(index)) &&
                             $.inArray(charCode, getActiveBufferTemplate().slice(lvp + 1, pos)) == -1)
                            ) {
                            $(input).trigger("keypress", [true, charCode.charCodeAt(0), writeOut, strict, index]);
                        }
                    });
                    if (strict === true) {
                        getActiveMaskSet()["lastValidPosition"] = seekPrevious(getActiveMaskSet()["p"]);
                    }
                }

                function escapeRegex(str) {
                    return $.inputmask.escapeRegex.call(this, str);
                }

                function truncateInput(inputValue) {
                    return inputValue.replace(new RegExp("(" + escapeRegex(getActiveBufferTemplate().join('')) + ")*$"), "");
                }

                function clearOptionalTail(input) {
                    var buffer = getActiveBuffer(), tmpBuffer = buffer.slice(), testPos, pos;
                    for (var pos = tmpBuffer.length - 1; pos >= 0; pos--) {
                        var testPos = determineTestPosition(pos);
                        if (getActiveTests()[testPos].optionality) {
                            if (!isMask(pos) || !isValid(pos, buffer[pos], true))
                                tmpBuffer.pop();
                            else break;
                        } else break;
                    }
                    writeBuffer(input, tmpBuffer);
                }

                //functionality fn
                this.unmaskedvalue = function ($input, skipDatepickerCheck) {
                    isRTL = $input.data('_inputmask')['isRTL'];
                    return unmaskedvalue($input, skipDatepickerCheck);
                };
                function unmaskedvalue($input, skipDatepickerCheck) {
                    if (getActiveTests() && (skipDatepickerCheck === true || !$input.hasClass('hasDatepicker'))) {
                        //checkVal(input, false, true);
                        return $.map(getActiveBuffer(), function (element, index) {
                            return isMask(index) && isValid(index, element, true) ? element : null;
                        }).join('');
                    } else {
                        return $input[0]._valueGet();
                    }
                }

                function caret(input, begin, end, notranslate) {
                    function TranslatePosition(pos) {
                        if (notranslate !== true && isRTL && typeof pos == 'number') {
                            var bffrLght = getActiveBuffer().length;
                            pos = bffrLght - pos;
                        }
                        return pos;
                    }

                    var npt = input.jquery && input.length > 0 ? input[0] : input, range;
                    if (typeof begin == 'number') {
                        begin = TranslatePosition(begin); end = TranslatePosition(end);
                        if (!$(input).is(':visible')) {
                            return;
                        }
                        end = (typeof end == 'number') ? end : begin;
                        if (opts.insertMode == false && begin == end) end++; //set visualization for insert/overwrite mode
                        if (npt.setSelectionRange) {
                            npt.selectionStart = begin;
                            npt.selectionEnd = android ? begin : end;

                        } else if (npt.createTextRange) {
                            range = npt.createTextRange();
                            range.collapse(true);
                            range.moveEnd('character', end);
                            range.moveStart('character', begin);
                            range.select();
                        }
                    } else {
                        if (!$(input).is(':visible')) {
                            return { "begin": 0, "end": 0 };
                        }
                        if (npt.setSelectionRange) {
                            begin = npt.selectionStart;
                            end = npt.selectionEnd;
                        } else if (document.selection && document.selection.createRange) {
                            range = document.selection.createRange();
                            begin = 0 - range.duplicate().moveStart('character', -100000);
                            end = begin + range.text.length;
                        }
                        begin = TranslatePosition(begin); end = TranslatePosition(end);
                        return { "begin": begin, "end": end };
                    }
                };

                this.isComplete = function (buffer) {
                    return isComplete(buffer);
                };
                function isComplete(buffer) {
                    var complete = false, highestValidPosition = 0, currentActiveMasksetIndex = activeMasksetIndex;
                    $.each(masksets, function (ndx, ms) {
                        if (typeof (ms) == "object") {
                            activeMasksetIndex = ndx;
                            var aml = seekPrevious(getMaskLength());
                            if (ms["lastValidPosition"] != undefined && ms["lastValidPosition"] >= highestValidPosition && ms["lastValidPosition"] == aml) {
                                var msComplete = true;
                                for (var i = 0; i <= aml; i++) {
                                    var mask = isMask(i), testPos = determineTestPosition(i);
                                    if ((mask && (buffer[i] == undefined || buffer[i] == getPlaceHolder(i))) || (!mask && buffer[i] != getActiveBufferTemplate()[testPos])) {
                                        msComplete = false;
                                        break;
                                    }
                                }
                                complete = complete || msComplete;
                                if (complete) //break loop
                                    return false;
                            }
                            highestValidPosition = ms["lastValidPosition"];
                        }
                    });
                    activeMasksetIndex = currentActiveMasksetIndex; //reset activeMaskset
                    return complete;
                }

                function isSelection(begin, end) {
                    return isRTL ? (begin - end) > 1 || ((begin - end) == 1 && opts.insertMode) :
                            (end - begin) > 1 || ((end - begin) == 1 && opts.insertMode);
                }

                this.mask = function (el) {
                    var $input = $(el);
                    if (!$input.is(":input")) return;

                    //store tests & original buffer in the input element - used to get the unmasked value
                    $input.data('_inputmask', {
                        'masksets': masksets,
                        'activeMasksetIndex': activeMasksetIndex,
                        'opts': opts,
                        'isRTL': false
                    });

                    //show tooltip
                    if (opts.showTooltip) {
                        $input.prop("title", getActiveMaskSet()["mask"]);
                    }

                    //correct greedy setting if needed
                    getActiveMaskSet()['greedy'] = getActiveMaskSet()['greedy'] ? getActiveMaskSet()['greedy'] : getActiveMaskSet()['repeat'] == 0;

                    //handle maxlength attribute
                    if ($input.attr("maxLength") != null) //only when the attribute is set
                    {
                        var maxLength = $input.prop('maxLength');
                        if (maxLength > -1) { //handle *-repeat
                            $.each(masksets, function (ndx, ms) {
                                if (typeof (ms) == "object") {
                                    if (ms["repeat"] == "*") {
                                        ms["repeat"] = maxLength;
                                    }
                                }
                            });
                        }
                        if (getMaskLength() > maxLength && maxLength > -1) { //FF sets no defined max length to -1 
                            if (maxLength < getActiveBufferTemplate().length) getActiveBufferTemplate().length = maxLength;
                            if (getActiveMaskSet()['greedy'] == false) {
                                getActiveMaskSet()['repeat'] = Math.round(maxLength / getActiveBufferTemplate().length);
                            }
                            $input.prop('maxLength', getMaskLength() * 2);
                        }
                    }

                    patchValueProperty(el);

                    //init vars
                    getActiveMaskSet()["undoBuffer"] = el._valueGet();
                    var skipKeyPressEvent = false, //Safari 5.1.x - modal dialog fires keypress twice workaround
                        ignorable = false;
                    if (el.dir == "rtl" || (opts.numericInput && opts.rightAlignNumerics) || (opts.isNumeric && opts.rightAlignNumerics))
                        $input.css("text-align", "right");

                    if (el.dir == "rtl" || opts.numericInput) {
                        el.dir = "ltr";
                        $input.removeAttr("dir");
                        var inputData = $input.data('_inputmask');
                        inputData['isRTL'] = true;
                        $input.data('_inputmask', inputData);
                        isRTL = true;
                    }

                    //unbind all events - to make sure that no other mask will interfere when re-masking
                    $input.unbind(".inputmask");
                    $input.removeClass('focus.inputmask');
                    //bind events
                    $input.closest('form').bind("submit", function () { //trigger change on submit if any
                        if ($input[0]._valueGet && $input[0]._valueGet() != getActiveMaskSet()["undoBuffer"]) {
                            $input.change();
                        }
                    }).bind('reset', function () {
                        $.each(masksets, function (ndx, ms) {
                            if (typeof (ms) == "object") {
                                ms["buffer"] = ms["_buffer"].slice();
                                ms["lastValidPosition"] = undefined;
                                ms["p"] = -1;
                            }
                        });
                    });
                    $input.bind("mouseenter.inputmask", function () {
                        var $input = $(this), input = this;
                        if (!$input.hasClass('focus.inputmask') && opts.showMaskOnHover) {
                            if (input._valueGet() != getActiveBuffer().join('')) {
                                writeBuffer(input, getActiveBuffer());
                            }
                        }
                    }).bind("blur.inputmask", function () {
                        var $input = $(this), input = this, nptValue = input._valueGet(), buffer = getActiveBuffer();
                        $input.removeClass('focus.inputmask');
                        if (nptValue != getActiveMaskSet()["undoBuffer"]) {
                            $input.change();
                        }
                        if (opts.clearMaskOnLostFocus && nptValue != '') {
                            if (nptValue == getActiveBufferTemplate().join(''))
                                input._valueSet('');
                            else { //clearout optional tail of the mask
                                clearOptionalTail(input);
                            }
                        }
                        if (!isComplete(buffer)) {
                            $input.trigger("incomplete");
                            if (opts.clearIncomplete) {
                                $.each(masksets, function (ndx, ms) {
                                    if (typeof (ms) == "object") {
                                        ms["buffer"] = ms["_buffer"].slice();
                                        ms["lastValidPosition"] = undefined;
                                        ms["p"] = 0;
                                    }
                                });
                                activeMasksetIndex = 0;
                                if (opts.clearMaskOnLostFocus)
                                    input._valueSet('');
                                else {
                                    buffer = getActiveBufferTemplate().slice();
                                    writeBuffer(input, buffer);
                                }
                            }
                        }
                    }).bind("focus.inputmask", function () {
                        var $input = $(this), input = this, nptValue = input._valueGet();
                        if (opts.showMaskOnFocus && !$input.hasClass('focus.inputmask') && (!opts.showMaskOnHover || (opts.showMaskOnHover && nptValue == ''))) {
                            if (input._valueGet() != getActiveBuffer().join('')) {
                                writeBuffer(input, getActiveBuffer(), getActiveMaskSet()["p"]);
                            }
                        }
                        $input.addClass('focus.inputmask');
                        getActiveMaskSet()["undoBuffer"] = input._valueGet();
                        $input.click();
                    }).bind("mouseleave.inputmask", function () {
                        var $input = $(this), input = this;
                        if (opts.clearMaskOnLostFocus) {
                            if (!$input.hasClass('focus.inputmask')) {
                                if (input._valueGet() == getActiveBufferTemplate().join('') || input._valueGet() == '')
                                    input._valueSet('');
                                else { //clearout optional tail of the mask
                                    clearOptionalTail(input);
                                }
                            }
                        }
                    }).bind("click.inputmask", function () {
                        var input = this;
                        setTimeout(function () {
                            var selectedCaret = caret(input), buffer = getActiveBuffer();
                            if (selectedCaret.begin == selectedCaret.end) {
                                var clickPosition = selectedCaret.begin,
                                    lvp = getActiveMaskSet()["lastValidPosition"],
                                    lastPosition;
                                if (opts.isNumeric) {
                                    lastPosition = opts.skipRadixDance === false && opts.radixPoint != "" && $.inArray(opts.radixPoint, buffer) != -1 ? $.inArray(opts.radixPoint, buffer) : getMaskLength();
                                } else {
                                    lastPosition = seekNext(lvp == undefined ? -1 : lvp);
                                }
                                caret(input, clickPosition < lastPosition && (isValid(clickPosition, buffer[clickPosition], true) !== false || !isMask(clickPosition)) ? clickPosition : lastPosition);
                            }
                        }, 0);
                    }).bind('dblclick.inputmask', function () {
                        var input = this;
                        if (getActiveMaskSet()["lastValidPosition"] != undefined) {
                            setTimeout(function () {
                                caret(input, 0, seekNext(getActiveMaskSet()["lastValidPosition"]));
                            }, 0);
                        }
                    }).bind("keydown.inputmask", keydownEvent
                    ).bind("keypress.inputmask", keypressEvent
                    ).bind("keyup.inputmask", keyupEvent
                    ).bind(pasteEvent + ".inputmask dragdrop.inputmask drop.inputmask", function () {
                        var input = this, $input = $(input);
                        setTimeout(function () {
                            checkVal(input, true, false);
                            if (isComplete(getActiveBuffer()))
                                $input.trigger("complete");
                            $input.click();
                        }, 0);
                    }).bind('setvalue.inputmask', function () {
                        var input = this;
                        getActiveMaskSet()["undoBuffer"] = input._valueGet();
                        checkVal(input, true);
                        if (input._valueGet() == getActiveBufferTemplate().join(''))
                            input._valueSet('');
                    }).bind('complete.inputmask', opts.oncomplete)
                        .bind('incomplete.inputmask', opts.onincomplete)
                        .bind('cleared.inputmask', opts.oncleared);

                    //apply mask
                    checkVal(el, true, false);
                    // Wrap document.activeElement in a try/catch block since IE9 throw "Unspecified error" if document.activeElement is undefined when we are in an IFrame.
                    var activeElement;
                    try {
                        activeElement = document.activeElement;
                    } catch (e) {
                    }
                    if (activeElement === el) { //position the caret when in focus
                        $input.addClass('focus.inputmask');
                        caret(el, getActiveMaskSet()["p"]);
                    } else if (opts.clearMaskOnLostFocus) {
                        if (getActiveBuffer().join('') == getActiveBufferTemplate().join('')) {
                            el._valueSet('');
                        } else {
                            clearOptionalTail(el);
                        }
                    } else {
                        writeBuffer(el, getActiveBuffer());
                    }

                    installEventRuler(el);

                    //private functions

                    function installEventRuler(npt) {
                        var events = $._data(npt).events;

                        $.each(events, function (eventType, eventHandlers) {
                            $.each(eventHandlers, function (ndx, eventHandler) {
                                if (eventHandler.namespace == "inputmask") {
                                    var handler = eventHandler.handler;
                                    eventHandler.handler = function (e) {
                                        if (this.readOnly || this.disabled)
                                            e.preventDefault;
                                        else
                                            return handler.apply(this, arguments);
                                    };
                                }
                            });
                        });
                    }

                    function patchValueProperty(npt) {
                        var valueProperty;
                        if (Object.getOwnPropertyDescriptor)
                            valueProperty = Object.getOwnPropertyDescriptor(npt, "value");
                        if (valueProperty && valueProperty.get) {
                            if (!npt._valueGet) {
                                var valueGet = valueProperty.get;
                                var valueSet = valueProperty.set;
                                npt._valueGet = function () {
                                    return isRTL ? valueGet.call(this).split('').reverse().join('') : valueGet.call(this);
                                };
                                npt._valueSet = function (value) {
                                    valueSet.call(this, isRTL ? value.split('').reverse().join('') : value);
                                };

                                Object.defineProperty(npt, "value", {
                                    get: function () {
                                        var $self = $(this), inputData = $(this).data('_inputmask'), masksets = inputData['masksets'],
                                            activeMasksetIndex = inputData['activeMasksetIndex'];
                                        return inputData && inputData['opts'].autoUnmask ? $self.inputmask('unmaskedvalue') : this._valueGet() != masksets[activeMasksetIndex]['_buffer'].join('') ? this._valueGet() : '';
                                    },
                                    set: function (value) {
                                        this._valueSet(value);
                                        $(this).triggerHandler('setvalue.inputmask');
                                    }
                                });
                            }
                        } else if (document.__lookupGetter__ && npt.__lookupGetter__("value")) {
                            if (!npt._valueGet) {
                                var valueGet = npt.__lookupGetter__("value");
                                var valueSet = npt.__lookupSetter__("value");
                                npt._valueGet = function () {
                                    return isRTL ? valueGet.call(this).split('').reverse().join('') : valueGet.call(this);
                                };
                                npt._valueSet = function (value) {
                                    valueSet.call(this, isRTL ? value.split('').reverse().join('') : value);
                                };

                                npt.__defineGetter__("value", function () {
                                    var $self = $(this), inputData = $(this).data('_inputmask'), masksets = inputData['masksets'],
                                        activeMasksetIndex = inputData['activeMasksetIndex'];
                                    return inputData && inputData['opts'].autoUnmask ? $self.inputmask('unmaskedvalue') : this._valueGet() != masksets[activeMasksetIndex]['_buffer'].join('') ? this._valueGet() : '';
                                });
                                npt.__defineSetter__("value", function (value) {
                                    this._valueSet(value);
                                    $(this).triggerHandler('setvalue.inputmask');
                                });
                            }
                        } else {
                            if (!npt._valueGet) {
                                npt._valueGet = function () { return isRTL ? this.value.split('').reverse().join('') : this.value; };
                                npt._valueSet = function (value) { this.value = isRTL ? value.split('').reverse().join('') : value; };
                            }
                            if ($.fn.val.inputmaskpatch != true) {
                                $.fn.val = function () {
                                    if (arguments.length == 0) {
                                        var $self = $(this);
                                        if ($self.data('_inputmask')) {
                                            if ($self.data('_inputmask')['opts'].autoUnmask)
                                                return $self.inputmask('unmaskedvalue');
                                            else {
                                                var result = $.inputmask.val.apply($self);
                                                var inputData = $(this).data('_inputmask'), masksets = inputData['masksets'],
                                                    activeMasksetIndex = inputData['activeMasksetIndex'];
                                                return result != masksets[activeMasksetIndex]['_buffer'].join('') ? result : '';
                                            }
                                        } else return $.inputmask.val.apply($self);
                                    } else {
                                        var args = arguments;
                                        return this.each(function () {
                                            var $self = $(this);
                                            var result = $.inputmask.val.apply($self, args);
                                            if ($self.data('_inputmask')) $self.triggerHandler('setvalue.inputmask');
                                            return result;
                                        });
                                    }
                                };
                                $.extend($.fn.val, {
                                    inputmaskpatch: true
                                });
                            }
                        }
                    }

                    //shift chars to left from start to end and put c at end position if defined
                    function shiftL(start, end, c) {
                        var buffer = getActiveBuffer();
                        while (!isMask(start) && start - 1 >= 0) start--; //jumping over nonmask position
                        for (var i = start; i < end && i < getMaskLength() ; i++) {
                            if (isMask(i)) {
                                setReTargetPlaceHolder(buffer, i);
                                var j = seekNext(i);
                                var p = getBufferElement(buffer, j);
                                if (p != getPlaceHolder(j)) {
                                    if (j < getMaskLength() && isValid(i, p, true) !== false && getActiveTests()[determineTestPosition(i)].def == getActiveTests()[determineTestPosition(j)].def) {
                                        setBufferElement(buffer, i, getBufferElement(buffer, j), true);
                                        if (j < end) {
                                            setReTargetPlaceHolder(buffer, j); //cleanup next position
                                        }
                                    } else {
                                        if (isMask(i))
                                            break;
                                    }
                                } //else if (c == undefined) break;
                            } else {
                                setReTargetPlaceHolder(buffer, i);
                            }
                        }
                        if (c != undefined)
                            setBufferElement(buffer, seekPrevious(end), c);

                        if (getActiveMaskSet()["greedy"] == false) {
                            var trbuffer = truncateInput(buffer.join('')).split('');
                            buffer.length = trbuffer.length;
                            for (var i = 0, bl = buffer.length; i < bl; i++) {
                                buffer[i] = trbuffer[i];
                            }
                            if (buffer.length == 0) getActiveMaskSet()["buffer"] = getActiveBufferTemplate().slice();
                        }
                        return start; //return the used start position
                    }

                    function shiftR(start, end, c, full) { //full => behave like a push right ~ do not stop on placeholders
                        var buffer = getActiveBuffer();
                        for (var i = start; i <= end && i < getMaskLength() ; i++) {
                            if (isMask(i)) {
                                var t = getBufferElement(buffer, i, true);
                                setBufferElement(buffer, i, c, true);
                                if (t != getPlaceHolder(i)) {
                                    var j = seekNext(i);
                                    if (j < getMaskLength()) {
                                        if (isValid(j, t, true) !== false && getActiveTests()[determineTestPosition(i)].def == getActiveTests()[determineTestPosition(j)].def)
                                            c = t;
                                        else {
                                            if (isMask(j))
                                                break;
                                            else c = t;
                                        }
                                    } else break;
                                } else {
                                    c = t;
                                    if (full !== true) break;
                                }
                            } else
                                setReTargetPlaceHolder(buffer, i);
                        }
                        var lengthBefore = buffer.length;
                        if (getActiveMaskSet()["greedy"] == false) {
                            var trbuffer = truncateInput(buffer.join('')).split('');
                            buffer.length = trbuffer.length;
                            for (var i = 0, bl = buffer.length; i < bl; i++) {
                                buffer[i] = trbuffer[i];
                            }
                            if (buffer.length == 0) getActiveMaskSet()["buffer"] = getActiveBufferTemplate().slice();
                        }
                        return end - (lengthBefore - buffer.length); //return new start position
                    }

                    ;

                    function keydownEvent(e) {
                        //Safari 5.1.x - modal dialog fires keypress twice workaround
                        skipKeyPressEvent = false;
                        var input = this, k = e.keyCode, pos = caret(input);

                        //backspace, delete, and escape get special treatment
                        if (k == opts.keyCode.BACKSPACE || k == opts.keyCode.DELETE || (iphone && k == 127) || (e.ctrlKey && k == 88)) { //backspace/delete
                            e.preventDefault(); //stop default action but allow propagation

                            if (opts.numericInput || isRTL) {
                                switch (k) {
                                    case opts.keyCode.BACKSPACE:
                                        k = opts.keyCode.DELETE;
                                        break;
                                    case opts.keyCode.DELETE:
                                        k = opts.keyCode.BACKSPACE;
                                        break;
                                }
                            }

                            if (isSelection(pos.begin, pos.end)) {
                                if (isRTL) {
                                    var pend = pos.end;
                                    pos.end = pos.begin;
                                    pos.begin = pend;
                                }
                                clearBuffer(getActiveBuffer(), pos.begin, pos.end);
                                if (pos.begin == 0 && pos.end == getMaskLength()) {
                                    $.each(masksets, function (ndx, ms) {
                                        if (typeof (ms) == "object") {
                                            ms["buffer"] = ms["_buffer"].slice();
                                            ms["lastValidPosition"] = undefined;
                                            ms["p"] = 0;
                                        }
                                    });
                                } else { //partial selection
                                    var ml = getMaskLength();
                                    if (opts.greedy == false) {
                                        shiftL(pos.begin, ml);
                                    } else {
                                        for (var i = pos.begin; i < pos.end; i++) {
                                            if (isMask(i))
                                                shiftL(pos.begin, ml);
                                        }
                                    }
                                    checkVal(input, false, true, getActiveBuffer());
                                }
                            } else {
                                $.each(masksets, function (ndx, ms) {
                                    if (typeof (ms) == "object") {
                                        activeMasksetIndex = ndx;
                                        var beginPos = android53x ? pos.end : pos.begin;
                                        var buffer = getActiveBuffer(), firstMaskPos = seekNext(-1),
                                            maskL = getMaskLength();
                                        if (k == opts.keyCode.DELETE) { //handle delete
                                            if (beginPos < firstMaskPos)
                                                beginPos = firstMaskPos;
                                            if (beginPos < maskL) {
                                                if (opts.isNumeric && opts.radixPoint != "" && buffer[beginPos] == opts.radixPoint) {
                                                    beginPos = (buffer.length - 1 == beginPos) /* radixPoint is latest? delete it */ ? beginPos : seekNext(beginPos);
                                                    beginPos = shiftL(beginPos, maskL);
                                                } else {
                                                    beginPos = shiftL(beginPos, maskL);
                                                }
                                                if (getActiveMaskSet()['lastValidPosition'] != undefined) {
                                                    if (getActiveMaskSet()['lastValidPosition'] != -1 && getActiveBuffer()[getActiveMaskSet()['lastValidPosition']] == getActiveBufferTemplate()[getActiveMaskSet()['lastValidPosition']])
                                                        getActiveMaskSet()["lastValidPosition"] = getActiveMaskSet()["lastValidPosition"] == 0 ? -1 : seekPrevious(getActiveMaskSet()["lastValidPosition"]);
                                                    if (getActiveMaskSet()['lastValidPosition'] < firstMaskPos) {
                                                        getActiveMaskSet()["lastValidPosition"] = undefined;
                                                        getActiveMaskSet()["p"] = firstMaskPos;
                                                    } else {
                                                        getActiveMaskSet()["writeOutBuffer"] = true;
                                                        getActiveMaskSet()["p"] = beginPos;
                                                    }
                                                }
                                            }
                                        } else if (k == opts.keyCode.BACKSPACE) { //handle backspace
                                            if (beginPos > firstMaskPos) {
                                                beginPos -= 1;
                                                if (opts.isNumeric && opts.radixPoint != "" && buffer[beginPos] == opts.radixPoint) {
                                                    beginPos = shiftR(0, (buffer.length - 1 == beginPos) /* radixPoint is latest? delete it */ ? beginPos : beginPos - 1, getPlaceHolder(beginPos), true);
                                                    beginPos++;
                                                } else {
                                                    beginPos = shiftL(beginPos, maskL);
                                                }
                                                if (getActiveMaskSet()['lastValidPosition'] != undefined) {
                                                    if (getActiveMaskSet()['lastValidPosition'] != -1 && getActiveBuffer()[getActiveMaskSet()['lastValidPosition']] == getActiveBufferTemplate()[getActiveMaskSet()['lastValidPosition']])
                                                        getActiveMaskSet()["lastValidPosition"] = getActiveMaskSet()["lastValidPosition"] == 0 ? -1 : seekPrevious(getActiveMaskSet()["lastValidPosition"]);
                                                    if (getActiveMaskSet()['lastValidPosition'] < firstMaskPos) {
                                                        getActiveMaskSet()["lastValidPosition"] = undefined;
                                                        getActiveMaskSet()["p"] = firstMaskPos;
                                                    } else {
                                                        getActiveMaskSet()["writeOutBuffer"] = true;
                                                        getActiveMaskSet()["p"] = beginPos;
                                                    }
                                                }
                                            } else if (activeMasksetIndex > 0) { //retry other masks
                                                getActiveMaskSet()["lastValidPosition"] = undefined;
                                                getActiveMaskSet()["writeOutBuffer"] = true;
                                                getActiveMaskSet()["p"] = firstMaskPos;
                                                //init first 
                                                activeMasksetIndex = 0;
                                                getActiveMaskSet()["buffer"] = getActiveBufferTemplate().slice();
                                                getActiveMaskSet()["p"] = seekNext(-1);
                                                getActiveMaskSet()["lastValidPosition"] = undefined;
                                            }
                                        }
                                    }
                                });

                            }

                            determineActiveMasksetIndex();
                            writeBuffer(input, getActiveBuffer(), getActiveMaskSet()["p"]);
                            if (input._valueGet() == getActiveBufferTemplate().join(''))
                                $(input).trigger('cleared');

                            if (opts.showTooltip) { //update tooltip
                                $input.prop("title", getActiveMaskSet()["mask"]);
                            }
                        } else if (k == opts.keyCode.END || k == opts.keyCode.PAGE_DOWN) { //when END or PAGE_DOWN pressed set position at lastmatch
                            setTimeout(function () {
                                var caretPos = seekNext(getActiveMaskSet()["lastValidPosition"]);
                                if (!opts.insertMode && caretPos == getMaskLength() && !e.shiftKey) caretPos--;
                                caret(input, e.shiftKey ? pos.begin : caretPos, caretPos);
                            }, 0);
                        } else if ((k == opts.keyCode.HOME && !e.shiftKey) || k == opts.keyCode.PAGE_UP) { //Home or page_up
                            caret(input, 0, e.shiftKey ? pos.begin : 0);
                        } else if (k == opts.keyCode.ESCAPE) { //escape
                            input._valueSet(getActiveMaskSet()["undoBuffer"]);
                            checkVal(input, true, true);
                        } else if (k == opts.keyCode.INSERT && !(e.shiftKey || e.ctrlKey)) { //insert
                            opts.insertMode = !opts.insertMode;
                            caret(input, !opts.insertMode && pos.begin == getMaskLength() ? pos.begin - 1 : pos.begin);
                        } else if (opts.insertMode == false && !e.shiftKey) {
                            if (k == opts.keyCode.RIGHT) {
                                setTimeout(function () {
                                    var caretPos = caret(input);
                                    caret(input, caretPos.begin);
                                }, 0);
                            } else if (k == opts.keyCode.LEFT) {
                                setTimeout(function () {
                                    var caretPos = caret(input);
                                    caret(input, caretPos.begin - 1);
                                }, 0);
                            }
                        }
                        var caretPos = caret(input);
                        opts.onKeyDown.call(this, e, getActiveBuffer(), opts); //extra stuff to execute on keydown
                        caret(input, caretPos.begin, caretPos.end);
                        ignorable = $.inArray(k, opts.ignorables) != -1;
                    }

                    function keypressEvent(e, checkval, k, writeOut, strict, ndx) {
                        //Safari 5.1.x - modal dialog fires keypress twice workaround
                        if (k == undefined && skipKeyPressEvent) return false;
                        skipKeyPressEvent = true;

                        var input = this, $input = $(input);

                        e = e || window.event;
                        var k = k || e.which || e.charCode || e.keyCode,
                            c = String.fromCharCode(k);

                        if ((!(e.ctrlKey && e.altKey) && (e.ctrlKey || e.metaKey || ignorable)) && checkval !== true) {
                            return true;
                        } else {
                            if (k) {
                                var pos, results, result;
                                if (checkval) {
                                    var pcaret = strict ? ndx : getActiveMaskSet()["p"];
                                    pos = { begin: pcaret, end: pcaret };
                                } else {
                                    pos = caret(input);
                                }

                                //should we clear a possible selection??
                                var isSlctn = isSelection(pos.begin, pos.end), redetermineLVP = false;
                                if (isSlctn) {
                                    if (isRTL) {
                                        var pend = pos.end;
                                        pos.end = pos.begin;
                                        pos.begin = pend;
                                    }
                                    var initialIndex = activeMasksetIndex;
                                    $.each(masksets, function (ndx, lmnt) {
                                        if (typeof (lmnt) == "object") {
                                            activeMasksetIndex = ndx;
                                            getActiveMaskSet()["undoBuffer"] = getActiveBuffer().join(''); //init undobuffer for recovery when not valid
                                            var posend = pos.end < getMaskLength() ? pos.end : getMaskLength();
                                            if (getActiveMaskSet()["lastValidPosition"] > pos.begin && getActiveMaskSet()["lastValidPosition"] < posend) {
                                                getActiveMaskSet()["lastValidPosition"] = seekPrevious(pos.begin);
                                            } else {
                                                redetermineLVP = true;
                                            }
                                            clearBuffer(getActiveBuffer(), pos.begin, posend);
                                            var ml = getMaskLength();
                                            if (opts.greedy == false) {
                                                shiftL(pos.begin, ml);
                                            } else {
                                                for (var i = pos.begin; i < posend; i++) {
                                                    if (isMask(i))
                                                        shiftL(pos.begin, ml);
                                                }
                                            }
                                        }
                                    });
                                    if (redetermineLVP === true) {
                                        activeMasksetIndex = initialIndex;
                                        checkVal(input, false, true, getActiveBuffer());
                                        if (!opts.insertMode) { //preserve some space
                                            $.each(masksets, function (ndx, lmnt) {
                                                if (typeof (lmnt) == "object") {
                                                    activeMasksetIndex = ndx;
                                                    shiftR(pos.begin, getMaskLength(), getPlaceHolder(pos.begin), true);
                                                    getActiveMaskSet()["lastValidPosition"] = seekNext(getActiveMaskSet()["lastValidPosition"]);
                                                }
                                            });
                                        }
                                    }
                                    activeMasksetIndex = initialIndex; //restore index
                                }

                                if (opts.isNumeric && c == opts.radixPoint && checkval !== true) {
                                    var nptStr = getActiveBuffer().join('');
                                    var radixPosition = nptStr.indexOf(opts.radixPoint);
                                    if (radixPosition != -1) {
                                        pos.begin = pos.begin == radixPosition ? seekNext(radixPosition) : radixPosition;
                                        pos.end = pos.begin;
                                        caret(input, pos.begin);
                                    }
                                }

                                var p = (opts.numericInput && strict != true && !isSlctn) ? seekPrevious(pos.begin) : seekNext(pos.begin - 1);
                                results = isValid(p, c, strict);
                                if (strict === true) results = [{ "activeMasksetIndex": activeMasksetIndex, "result": results }];
                                $.each(results, function (index, result) {
                                    activeMasksetIndex = result["activeMasksetIndex"];
                                    getActiveMaskSet()["writeOutBuffer"] = true;
                                    var np = result["result"];
                                    if (np !== false) {
                                        var refresh = false, buffer = getActiveBuffer();
                                        if (np !== true) {
                                            refresh = np["refresh"]; //only rewrite buffer from isValid
                                            p = np.pos != undefined ? np.pos : p; //set new position from isValid
                                            c = np.c != undefined ? np.c : c; //set new char from isValid
                                        }
                                        if (refresh !== true) {
                                            if (opts.insertMode == true) {
                                                var lastUnmaskedPosition = getMaskLength();
                                                var bfrClone = buffer.slice();
                                                while (getBufferElement(bfrClone, lastUnmaskedPosition, true) != getPlaceHolder(lastUnmaskedPosition) && lastUnmaskedPosition >= p) {
                                                    lastUnmaskedPosition = lastUnmaskedPosition == 0 ? -1 : seekPrevious(lastUnmaskedPosition);
                                                }
                                                if (lastUnmaskedPosition >= p) {
                                                    shiftR(p, buffer.length, c);
                                                    //shift the lvp if needed
                                                    var lvp = getActiveMaskSet()["lastValidPosition"], nlvp = seekNext(lvp);
                                                    if (nlvp != getMaskLength() && lvp >= p && (getBufferElement(getActiveBuffer(), nlvp) != getPlaceHolder(nlvp))) {
                                                        getActiveMaskSet()["lastValidPosition"] = nlvp;
                                                    }
                                                } else getActiveMaskSet()["writeOutBuffer"] = false;
                                            } else setBufferElement(buffer, p, c, true);
                                        }
                                        getActiveMaskSet()["p"] = seekNext(p);
                                    }
                                });

                                if (strict !== true) determineActiveMasksetIndex();
                                if (writeOut !== false) {
                                    $.each(results, function (ndx, rslt) {
                                        if (rslt["activeMasksetIndex"] == activeMasksetIndex) {
                                            result = rslt;
                                            return false;
                                        }
                                    });
                                    if (result != undefined) {
                                        var self = this;
                                        setTimeout(function () { opts.onKeyValidation.call(self, result["result"], opts); }, 0);
                                        if (getActiveMaskSet()["writeOutBuffer"] && result["result"] !== false) {
                                            var buffer = getActiveBuffer();
                                            writeBuffer(input, buffer, checkval ? undefined : (opts.numericInput ? seekPrevious(getActiveMaskSet()["p"]) : getActiveMaskSet()["p"]));
                                            if (checkval !== true) {
                                                setTimeout(function () { //timeout needed for IE
                                                    if (isComplete(buffer))
                                                        $input.trigger("complete");
                                                }, 0);
                                            }
                                        } else if (isSlctn) {
                                            getActiveMaskSet()["buffer"] = getActiveMaskSet()["undoBuffer"].split('');
                                        }
                                    }
                                }

                                if (opts.showTooltip) { //update tooltip
                                    $input.prop("title", getActiveMaskSet()["mask"]);
                                }
                                e.preventDefault();
                            }
                        }
                    }

                    function keyupEvent(e) {
                        var $input = $(this), input = this, k = e.keyCode, buffer = getActiveBuffer();
                        var caretPos = caret(input);
                        opts.onKeyUp.call(this, e, buffer, opts); //extra stuff to execute on keyup
                        caret(input, caretPos.begin, caretPos.end);
                        if (k == opts.keyCode.TAB && $input.hasClass('focus.inputmask') && input._valueGet().length == 0 && opts.showMaskOnFocus) {
                            buffer = getActiveBufferTemplate().slice();
                            writeBuffer(input, buffer);
                            caret(input, 0);
                            getActiveMaskSet()["undoBuffer"] = input._valueGet();
                        }
                    }
                };
                return this;
            };
            return this;
        };
    }
})(jQuery);
/*
Input Mask plugin extensions
http://github.com/RobinHerbots/jquery.inputmask
Copyright (c) 2010 - 2013 Robin Herbots
Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
Version: 2.3.17

Optional extensions on the jquery.inputmask base
*/
(function ($) {
    //extra definitions
    $.extend($.inputmask.defaults.definitions, {
        'A': { 
            validator: "[A-Za-z]",
            cardinality: 1,
            casing: "upper" //auto uppercasing
        },
        '#': {
            validator: "[A-Za-z\u0410-\u044F\u0401\u04510-9]",
            cardinality: 1,
            casing: "upper"
        }
    });
    $.extend($.inputmask.defaults.aliases, {
        'url': {
            mask: "ir",
            placeholder: "",
            separator: "",
            defaultPrefix: "http://",
            regex: {
                urlpre1: new RegExp("[fh]"),
                urlpre2: new RegExp("(ft|ht)"),
                urlpre3: new RegExp("(ftp|htt)"),
                urlpre4: new RegExp("(ftp:|http|ftps)"),
                urlpre5: new RegExp("(ftp:/|ftps:|http:|https)"),
                urlpre6: new RegExp("(ftp://|ftps:/|http:/|https:)"),
                urlpre7: new RegExp("(ftp://|ftps://|http://|https:/)"),
                urlpre8: new RegExp("(ftp://|ftps://|http://|https://)")
            },
            definitions: {
                'i': {
                    validator: function (chrs, buffer, pos, strict, opts) {
                        return true;
                    },
                    cardinality: 8,
                    prevalidator: (function () {
                        var result = [], prefixLimit = 8;
                        for (var i = 0; i < prefixLimit; i++) {
                            result[i] = (function () {
                                var j = i;
                                return {
                                    validator: function (chrs, buffer, pos, strict, opts) {
                                        if (opts.regex["urlpre" + (j + 1)]) {
                                            var tmp = chrs, k;
                                            if (((j + 1) - chrs.length) > 0) {
                                                tmp = buffer.join('').substring(0, ((j + 1) - chrs.length)) + "" + tmp;
                                            }
                                            var isValid = opts.regex["urlpre" + (j + 1)].test(tmp);
                                            if (!strict && !isValid) {
                                                pos = pos - j;
                                                for (k = 0; k < opts.defaultPrefix.length; k++) {
                                                    buffer[pos] = opts.defaultPrefix[k]; pos++;
                                                }
                                                for (k = 0; k < tmp.length - 1; k++) {
                                                    buffer[pos] = tmp[k]; pos++;
                                                }
                                                return { "pos": pos };
                                            }
                                            return isValid;
                                        } else {
                                            return false;
                                        }
                                    }, cardinality: j
                                };
                            })();
                        }
                        return result;
                    })()
                },
                "r": {
                    validator: ".",
                    cardinality: 50
                }
            },
            insertMode: false,
            autoUnmask: false
        },
        "ip": {
            mask: "i.i.i.i",
            definitions: {
                'i': {
                    validator: "25[0-5]|2[0-4][0-9]|[01][0-9][0-9]",
                    cardinality: 3,
                    prevalidator: [
                                { validator: "[0-2]", cardinality: 1 },
                                { validator: "2[0-5]|[01][0-9]", cardinality: 2 }
                    ]
                }
            }
        }
    });
})(jQuery);
/*
Input Mask plugin extensions
http://github.com/RobinHerbots/jquery.inputmask
Copyright (c) 2010 - 2012 Robin Herbots
Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
Version: 2.3.17

Optional extensions on the jquery.inputmask base
*/
(function ($) {
    //date & time aliases
    $.extend($.inputmask.defaults.definitions, {
        'h': { //hours
            validator: "[01][0-9]|2[0-3]",
            cardinality: 2,
            prevalidator: [{ validator: "[0-2]", cardinality: 1 }]
        },
        's': { //seconds || minutes
            validator: "[0-5][0-9]",
            cardinality: 2,
            prevalidator: [{ validator: "[0-5]", cardinality: 1 }]
        },
        'd': { //basic day
            validator: "0[1-9]|[12][0-9]|3[01]",
            cardinality: 2,
            prevalidator: [{ validator: "[0-3]", cardinality: 1 }]
        },
        'm': { //basic month
            validator: "0[1-9]|1[012]",
            cardinality: 2,
            prevalidator: [{ validator: "[01]", cardinality: 1 }]
        },
        'y': { //basic year
            validator: "(19|20)\\d{2}",
            cardinality: 4,
            prevalidator: [
                        { validator: "[12]", cardinality: 1 },
                        { validator: "(19|20)", cardinality: 2 },
                        { validator: "(19|20)\\d", cardinality: 3 }
            ]
        }
    });
    $.extend($.inputmask.defaults.aliases, {
        'dd/mm/yyyy': {
            mask: "1/2/y",
            placeholder: "dd/mm/yyyy",
            regex: {
                val1pre: new RegExp("[0-3]"), //daypre
                val1: new RegExp("0[1-9]|[12][0-9]|3[01]"), //day
                val2pre: function (separator) { var escapedSeparator = $.inputmask.escapeRegex.call(this, separator); return new RegExp("((0[1-9]|[12][0-9]|3[01])" + escapedSeparator + "[01])"); }, //monthpre
                val2: function (separator) { var escapedSeparator = $.inputmask.escapeRegex.call(this, separator); return new RegExp("((0[1-9]|[12][0-9])" + escapedSeparator + "(0[1-9]|1[012]))|(30" + escapedSeparator + "(0[13-9]|1[012]))|(31" + escapedSeparator + "(0[13578]|1[02]))"); }//month
            },
            leapday: "29/02/",
            separator: '/',
            yearrange: { minyear: 1900, maxyear: 2099 },
            isInYearRange: function (chrs, minyear, maxyear) {
                var enteredyear = parseInt(chrs.concat(minyear.toString().slice(chrs.length)));
                var enteredyear2 = parseInt(chrs.concat(maxyear.toString().slice(chrs.length)));
                return (enteredyear != NaN ? minyear <= enteredyear && enteredyear <= maxyear : false) ||
            		   (enteredyear2 != NaN ? minyear <= enteredyear2 && enteredyear2 <= maxyear : false);
            },
            determinebaseyear: function (minyear, maxyear, hint) {
                var currentyear = (new Date()).getFullYear();
                if (minyear > currentyear) return minyear;
                if (maxyear < currentyear) {
                    var maxYearPrefix = maxyear.toString().slice(0, 2);
                    var maxYearPostfix = maxyear.toString().slice(2, 4);
                    while (maxyear < maxYearPrefix + hint) {
                        maxYearPrefix--;
                    }
                    var maxxYear = maxYearPrefix + maxYearPostfix;
                    return minyear > maxxYear ? minyear : maxxYear;
                }

                return currentyear;
            },
            onKeyUp: function (e, buffer, opts) {
                var $input = $(this);
                if (e.ctrlKey && e.keyCode == opts.keyCode.RIGHT) {
                    var today = new Date();
                    $input.val(today.getDate().toString() + (today.getMonth() + 1).toString() + today.getFullYear().toString());
                }
            },
            definitions: {
                '1': { //val1 ~ day or month
                    validator: function (chrs, buffer, pos, strict, opts) {
                        var isValid = opts.regex.val1.test(chrs);
                        if (!strict && !isValid) {
                            if (chrs.charAt(1) == opts.separator || "-./".indexOf(chrs.charAt(1)) != -1) {
                                isValid = opts.regex.val1.test("0" + chrs.charAt(0));
                                if (isValid) {
                                    buffer[pos - 1] = "0";
                                    return { "pos": pos, "c": chrs.charAt(0) };
                                }
                            }
                        }
                        return isValid;
                    },
                    cardinality: 2,
                    prevalidator: [{
                        validator: function (chrs, buffer, pos, strict, opts) {
                            var isValid = opts.regex.val1pre.test(chrs);
                            if (!strict && !isValid) {
                                isValid = opts.regex.val1.test("0" + chrs);
                                if (isValid) {
                                    buffer[pos] = "0";
                                    pos++;
                                    return { "pos": pos };
                                }
                            }
                            return isValid;
                        }, cardinality: 1
                    }]
                },
                '2': { //val2 ~ day or month
                    validator: function (chrs, buffer, pos, strict, opts) {
                        var frontValue = buffer.join('').substr(0, 3);
                        var isValid = opts.regex.val2(opts.separator).test(frontValue + chrs);
                        if (!strict && !isValid) {
                            if (chrs.charAt(1) == opts.separator || "-./".indexOf(chrs.charAt(1)) != -1) {
                                isValid = opts.regex.val2(opts.separator).test(frontValue + "0" + chrs.charAt(0));
                                if (isValid) {
                                    buffer[pos - 1] = "0";
                                    return { "pos": pos, "c": chrs.charAt(0) };
                                }
                            }
                        }
                        return isValid;
                    },
                    cardinality: 2,
                    prevalidator: [{
                        validator: function (chrs, buffer, pos, strict, opts) {
                            var frontValue = buffer.join('').substr(0, 3);
                            var isValid = opts.regex.val2pre(opts.separator).test(frontValue + chrs);
                            if (!strict && !isValid) {
                                isValid = opts.regex.val2(opts.separator).test(frontValue + "0" + chrs);
                                if (isValid) {
                                    buffer[pos] = "0";
                                    pos++;
                                    return { "pos": pos };
                                }
                            }
                            return isValid;
                        }, cardinality: 1
                    }]
                },
                'y': { //year
                    validator: function (chrs, buffer, pos, strict, opts) {
                        if (opts.isInYearRange(chrs, opts.yearrange.minyear, opts.yearrange.maxyear)) {
                            var dayMonthValue = buffer.join('').substr(0, 6);
                            if (dayMonthValue != opts.leapday)
                                return true;
                            else {
                                var year = parseInt(chrs, 10);//detect leap year
                                if (year % 4 === 0)
                                    if (year % 100 === 0)
                                        if (year % 400 === 0)
                                            return true;
                                        else return false;
                                    else return true;
                                else return false;
                            }
                        } else return false;
                    },
                    cardinality: 4,
                    prevalidator: [
                {
                    validator: function (chrs, buffer, pos, strict, opts) {
                        var isValid = opts.isInYearRange(chrs, opts.yearrange.minyear, opts.yearrange.maxyear);
                        if (!strict && !isValid) {
                            var yearPrefix = opts.determinebaseyear(opts.yearrange.minyear, opts.yearrange.maxyear, chrs + "0").toString().slice(0, 1);

                            isValid = opts.isInYearRange(yearPrefix + chrs, opts.yearrange.minyear, opts.yearrange.maxyear);
                            if (isValid) {
                                buffer[pos++] = yearPrefix[0];
                                return { "pos": pos };
                            }
                            yearPrefix = opts.determinebaseyear(opts.yearrange.minyear, opts.yearrange.maxyear, chrs + "0").toString().slice(0, 2);

                            isValid = opts.isInYearRange(yearPrefix + chrs, opts.yearrange.minyear, opts.yearrange.maxyear);
                            if (isValid) {
                                buffer[pos++] = yearPrefix[0];
                                buffer[pos++] = yearPrefix[1];
                                return { "pos": pos };
                            }
                        }
                        return isValid;
                    },
                    cardinality: 1
                },
                {
                    validator: function (chrs, buffer, pos, strict, opts) {
                        var isValid = opts.isInYearRange(chrs, opts.yearrange.minyear, opts.yearrange.maxyear);
                        if (!strict && !isValid) {
                            var yearPrefix = opts.determinebaseyear(opts.yearrange.minyear, opts.yearrange.maxyear, chrs).toString().slice(0, 2);

                            isValid = opts.isInYearRange(chrs[0] + yearPrefix[1] + chrs[1], opts.yearrange.minyear, opts.yearrange.maxyear);
                            if (isValid) {
                                buffer[pos++] = yearPrefix[1];
                                return { "pos": pos };
                            }

                            yearPrefix = opts.determinebaseyear(opts.yearrange.minyear, opts.yearrange.maxyear, chrs).toString().slice(0, 2);
                            if (opts.isInYearRange(yearPrefix + chrs, opts.yearrange.minyear, opts.yearrange.maxyear)) {
                                var dayMonthValue = buffer.join('').substr(0, 6);
                                if (dayMonthValue != opts.leapday)
                                    isValid = true;
                                else {
                                    var year = parseInt(chrs, 10);//detect leap year
                                    if (year % 4 === 0)
                                        if (year % 100 === 0)
                                            if (year % 400 === 0)
                                                isValid = true;
                                            else isValid = false;
                                        else isValid = true;
                                    else isValid = false;
                                }
                            } else isValid = false;
                            if (isValid) {
                                buffer[pos - 1] = yearPrefix[0];
                                buffer[pos++] = yearPrefix[1];
                                buffer[pos++] = chrs[0];
                                return { "pos": pos };
                            }
                        }
                        return isValid;
                    }, cardinality: 2
                },
                {
                    validator: function (chrs, buffer, pos, strict, opts) {
                        return opts.isInYearRange(chrs, opts.yearrange.minyear, opts.yearrange.maxyear);
                    }, cardinality: 3
                }
                    ]
                }
            },
            insertMode: false,
            autoUnmask: false
        },
        'mm/dd/yyyy': {
            placeholder: "mm/dd/yyyy",
            alias: "dd/mm/yyyy", //reuse functionality of dd/mm/yyyy alias
            regex: {
                val2pre: function (separator) { var escapedSeparator = $.inputmask.escapeRegex.call(this, separator); return new RegExp("((0[13-9]|1[012])" + escapedSeparator + "[0-3])|(02" + escapedSeparator + "[0-2])"); }, //daypre
                val2: function (separator) { var escapedSeparator = $.inputmask.escapeRegex.call(this, separator); return new RegExp("((0[1-9]|1[012])" + escapedSeparator + "(0[1-9]|[12][0-9]))|((0[13-9]|1[012])" + escapedSeparator + "30)|((0[13578]|1[02])" + escapedSeparator + "31)"); }, //day
                val1pre: new RegExp("[01]"), //monthpre
                val1: new RegExp("0[1-9]|1[012]") //month
            },
            leapday: "02/29/",
            onKeyUp: function (e, buffer, opts) {
                var $input = $(this);
                if (e.ctrlKey && e.keyCode == opts.keyCode.RIGHT) {
                    var today = new Date();
                    $input.val((today.getMonth() + 1).toString() + today.getDate().toString() + today.getFullYear().toString());
                }
            }
        },
        'yyyy/mm/dd': {
            mask: "y/1/2",
            placeholder: "yyyy/mm/dd",
            alias: "mm/dd/yyyy",
            leapday: "/02/29",
            onKeyUp: function (e, buffer, opts) {
                var $input = $(this);
                if (e.ctrlKey && e.keyCode == opts.keyCode.RIGHT) {
                    var today = new Date();
                    $input.val(today.getFullYear().toString() + (today.getMonth() + 1).toString() + today.getDate().toString());
                }
            },
            definitions: {
                '2': { //val2 ~ day or month
                    validator: function (chrs, buffer, pos, strict, opts) {
                        var frontValue = buffer.join('').substr(5, 3);
                        var isValid = opts.regex.val2(opts.separator).test(frontValue + chrs);
                        if (!strict && !isValid) {
                            if (chrs.charAt(1) == opts.separator || "-./".indexOf(chrs.charAt(1)) != -1) {
                                isValid = opts.regex.val2(opts.separator).test(frontValue + "0" + chrs.charAt(0));
                                if (isValid) {
                                    buffer[pos - 1] = "0";
                                    return { "pos": pos, "c": chrs.charAt(0) };
                                }
                            }
                        }

                        //check leap yeap
                        if (isValid) {
                            var dayMonthValue = buffer.join('').substr(4, 4) + chrs;
                            if (dayMonthValue != opts.leapday)
                                return true;
                            else {
                                var year = parseInt(buffer.join('').substr(0, 4), 10);  //detect leap year
                                if (year % 4 === 0)
                                    if (year % 100 === 0)
                                        if (year % 400 === 0)
                                            return true;
                                        else return false;
                                    else return true;
                                else return false;
                            }
                        }

                        return isValid;
                    },
                    cardinality: 2,
                    prevalidator: [{
                        validator: function (chrs, buffer, pos, strict, opts) {
                            var frontValue = buffer.join('').substr(5, 3);
                            var isValid = opts.regex.val2pre(opts.separator).test(frontValue + chrs);
                            if (!strict && !isValid) {
                                isValid = opts.regex.val2(opts.separator).test(frontValue + "0" + chrs);
                                if (isValid) {
                                    buffer[pos] = "0";
                                    pos++;
                                    return { "pos": pos };
                                }
                            }
                            return isValid;
                        }, cardinality: 1
                    }]
                }
            }
        },
        'dd.mm.yyyy': {
            mask: "1.2.y",
            placeholder: "dd.mm.yyyy",
            leapday: "29.02.",
            separator: '.',
            alias: "dd/mm/yyyy"
        },
        'dd-mm-yyyy': {
            mask: "1-2-y",
            placeholder: "dd-mm-yyyy",
            leapday: "29-02-",
            separator: '-',
            alias: "dd/mm/yyyy"
        },
        'mm.dd.yyyy': {
            mask: "1.2.y",
            placeholder: "mm.dd.yyyy",
            leapday: "02.29.",
            separator: '.',
            alias: "mm/dd/yyyy"
        },
        'mm-dd-yyyy': {
            mask: "1-2-y",
            placeholder: "mm-dd-yyyy",
            leapday: "02-29-",
            separator: '-',
            alias: "mm/dd/yyyy"
        },
        'yyyy.mm.dd': {
            mask: "y.1.2",
            placeholder: "yyyy.mm.dd",
            leapday: ".02.29",
            separator: '.',
            alias: "yyyy/mm/dd"
        },
        'yyyy-mm-dd': {
            mask: "y-1-2",
            placeholder: "yyyy-mm-dd",
            leapday: "-02-29",
            separator: '-',
            alias: "yyyy/mm/dd"
        },
        'datetime': {
            mask: "1/2/y h:s",
            placeholder: "dd/mm/yyyy hh:mm",
            alias: "dd/mm/yyyy",
            regex: {
                hrspre: new RegExp("[012]"), //hours pre
                hrs24: new RegExp("2[0-9]|1[3-9]"),
                hrs: new RegExp("[01][0-9]|2[0-3]"), //hours
                ampm: new RegExp("^[a|p|A|P][m|M]")
            },
            timeseparator: ':',
            hourFormat: "24", // or 12
            definitions: {
                'h': { //hours
                    validator: function (chrs, buffer, pos, strict, opts) {
                        var isValid = opts.regex.hrs.test(chrs);
                        if (!strict && !isValid) {
                            if (chrs.charAt(1) == opts.timeseparator || "-.:".indexOf(chrs.charAt(1)) != -1) {
                                isValid = opts.regex.hrs.test("0" + chrs.charAt(0));
                                if (isValid) {
                                    buffer[pos - 1] = "0";
                                    buffer[pos] = chrs.charAt(0);
                                    pos++;
                                    return { "pos": pos };
                                }
                            }
                        }

                        if (isValid && opts.hourFormat !== "24" && opts.regex.hrs24.test(chrs)) {

                            var tmp = parseInt(chrs, 10);

                            if (tmp == 24) {
                                buffer[pos + 5] = "a";
                                buffer[pos + 6] = "m";
                            } else {
                                buffer[pos + 5] = "p";
                                buffer[pos + 6] = "m";
                            }

                            tmp = tmp - 12;

                            if (tmp < 10) {
                                buffer[pos] = tmp.toString();
                                buffer[pos - 1] = "0";
                            } else {
                                buffer[pos] = tmp.toString().charAt(1);
                                buffer[pos - 1] = tmp.toString().charAt(0);
                            }

                            return { "pos": pos, "c": buffer[pos] };
                        }

                        return isValid;
                    },
                    cardinality: 2,
                    prevalidator: [{
                        validator: function (chrs, buffer, pos, strict, opts) {
                            var isValid = opts.regex.hrspre.test(chrs);
                            if (!strict && !isValid) {
                                isValid = opts.regex.hrs.test("0" + chrs);
                                if (isValid) {
                                    buffer[pos] = "0";
                                    pos++;
                                    return { "pos": pos };
                                }
                            }
                            return isValid;
                        }, cardinality: 1
                    }]
                },
                't': { //am/pm
                    validator: function (chrs, buffer, pos, strict, opts) {
                        return opts.regex.ampm.test(chrs + "m");
                    },
                    casing: "lower",
                    cardinality: 1
                }
            },
            insertMode: false,
            autoUnmask: false
        },
        'datetime12': {
            mask: "1/2/y h:s t\\m",
            placeholder: "dd/mm/yyyy hh:mm xm",
            alias: "datetime",
            hourFormat: "12"
        },
        'hh:mm t': {
            mask: "h:s t\\m",
            placeholder: "hh:mm xm",
            alias: "datetime",
            hourFormat: "12"
        },
        'h:s t': {
            mask: "h:s t\\m",
            placeholder: "hh:mm xm",
            alias: "datetime",
            hourFormat: "12"
        },
        'hh:mm:ss': {
            mask: "h:s:s",
            autoUnmask: false
        },
        'hh:mm': {
            mask: "h:s",
            autoUnmask: false
        },
        'date': {
            alias: "dd-mm-yyyy" // "mm/dd/yyyy"
        }
    });
})(jQuery);
/*
Input Mask plugin extensions
http://github.com/RobinHerbots/jquery.inputmask
Copyright (c) 2010 - 2013 Robin Herbots
Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
Version: 2.3.17

Optional extensions on the jquery.inputmask base
*/
(function ($) {
    //number aliases
    $.extend($.inputmask.defaults.aliases, {
        'decimal': {
            mask: "~",
            placeholder: "",
            repeat: "*",
            greedy: false,
            numericInput: false,
            isNumeric: true,
            digits: "*", //numer of digits
            groupSeparator: "",//",", // | "."
            radixPoint: ".",
            groupSize: 3,
            autoGroup: false,
            allowPlus: true,
            allowMinus: true,
            getMaskLength: function (buffer, greedy, repeat, currentBuffer, opts) { //custom getMaskLength to take the groupSeparator into account
                var calculatedLength = buffer.length;

                if (!greedy) {
                    if (repeat == "*") {
                        calculatedLength = currentBuffer.length + 1;
                    } else if (repeat > 1) {
                        calculatedLength += (buffer.length * (repeat - 1));
                    }
                }

                var escapedGroupSeparator = $.inputmask.escapeRegex.call(this, opts.groupSeparator);
                var escapedRadixPoint = $.inputmask.escapeRegex.call(this, opts.radixPoint);
                var currentBufferStr = currentBuffer.join(''), strippedBufferStr = currentBufferStr.replace(new RegExp(escapedGroupSeparator, "g"), "").replace(new RegExp(escapedRadixPoint), ""),
                groupOffset = currentBufferStr.length - strippedBufferStr.length;
                return calculatedLength + groupOffset;
            },
            postFormat: function (buffer, pos, reformatOnly, opts) {
                if (opts.groupSeparator == "") return pos;
                var cbuf = buffer.slice(),
                    radixPos = $.inArray(opts.radixPoint, buffer);
                if (!reformatOnly) {
                    cbuf.splice(pos, 0, "?"); //set position indicator
                }
                var bufVal = cbuf.join('');
                if (opts.autoGroup || (reformatOnly && bufVal.indexOf(opts.groupSeparator) != -1)) {
                    var escapedGroupSeparator = $.inputmask.escapeRegex.call(this, opts.groupSeparator);
                    bufVal = bufVal.replace(new RegExp(escapedGroupSeparator, "g"), '');
                    var radixSplit = bufVal.split(opts.radixPoint);
                    bufVal = radixSplit[0];
                    var reg = new RegExp('([-\+]?[\\d\?]+)([\\d\?]{' + opts.groupSize + '})');
                    while (reg.test(bufVal)) {
                        bufVal = bufVal.replace(reg, '$1' + opts.groupSeparator + '$2');
                        bufVal = bufVal.replace(opts.groupSeparator + opts.groupSeparator, opts.groupSeparator);
                    }
                    if (radixSplit.length > 1)
                        bufVal += opts.radixPoint + radixSplit[1];
                }
                buffer.length = bufVal.length; //align the length
                for (var i = 0, l = bufVal.length; i < l; i++) {
                    buffer[i] = bufVal.charAt(i);
                }
                var newPos = $.inArray("?", buffer);
                if (!reformatOnly) buffer.splice(newPos, 1);

                return reformatOnly ? pos : newPos;
            },
            regex: {
                number: function (opts) {
                    var escapedGroupSeparator = $.inputmask.escapeRegex.call(this, opts.groupSeparator);
                    var escapedRadixPoint = $.inputmask.escapeRegex.call(this, opts.radixPoint);
                    var digitExpression = isNaN(opts.digits) ? opts.digits : '{0,' + opts.digits + '}';
                    var signedExpression = "[" + (opts.allowPlus ? "\+" : "") + (opts.allowMinus ? "-" : "") + "]?";
                    return new RegExp("^" + signedExpression + "(\\d+|\\d{1," + opts.groupSize + "}((" + escapedGroupSeparator + "\\d{" + opts.groupSize + "})?)+)(" + escapedRadixPoint + "\\d" + digitExpression + ")?$");
                }
            },
            onKeyDown: function (e, buffer, opts) {
                var $input = $(this), input = this;
                if (e.keyCode == opts.keyCode.TAB) {
                    var radixPosition = $.inArray(opts.radixPoint, buffer);
                    if (radixPosition != -1) {
                        var masksets = $input.data('_inputmask')['masksets'];
                        var activeMasksetIndex = $input.data('_inputmask')['activeMasksetIndex'];
                        for (var i = 1; i <= opts.digits && i < opts.getMaskLength(masksets[activeMasksetIndex]["_buffer"], masksets[activeMasksetIndex]["greedy"], masksets[activeMasksetIndex]["repeat"], buffer, opts) ; i++) {
                            if (buffer[radixPosition + i] == undefined) buffer[radixPosition + i] = "0";
                        }
                        input._valueSet(buffer.join(''));
                    }
                } else if (e.keyCode == opts.keyCode.DELETE || e.keyCode == opts.keyCode.BACKSPACE) {
                    opts.postFormat(buffer, 0, true, opts);
                    input._valueSet(buffer.join(''));
                }
            },
            definitions: {
                '~': { //real number
                    validator: function (chrs, buffer, pos, strict, opts) {
                        if (chrs == "") return false;
                        if (!strict && pos <= 1 && buffer[0] === '0' && new RegExp("[\\d-]").test(chrs) && buffer.length == 1) { //handle first char
                            buffer[0] = "";
                            return { "pos": 0 };
                        }

                        var cbuf = strict ? buffer.slice(0, pos) : buffer.slice();

                        cbuf.splice(pos, 0, chrs);
                        var bufferStr = cbuf.join('');

                        //strip groupseparator
                        var escapedGroupSeparator = $.inputmask.escapeRegex.call(this, opts.groupSeparator);
                        bufferStr = bufferStr.replace(new RegExp(escapedGroupSeparator, "g"), '');
                        
                        var isValid = opts.regex.number(opts).test(bufferStr);
                        if (!isValid) {
                            //let's help the regex a bit
                            bufferStr += "0";
                            isValid = opts.regex.number(opts).test(bufferStr);
                            if (!isValid) {
                                //make a valid group
                                var lastGroupSeparator = bufferStr.lastIndexOf(opts.groupSeparator);
                                for (i = bufferStr.length - lastGroupSeparator; i <= 3; i++) {
                                    bufferStr += "0";
                                }

                                isValid = opts.regex.number(opts).test(bufferStr);
                                if (!isValid && !strict) {
                                    if (chrs == opts.radixPoint) {
                                        isValid = opts.regex.number(opts).test("0" + bufferStr + "0");
                                        if (isValid) {
                                            buffer[pos] = "0";
                                            pos++;
                                            return { "pos": pos };
                                        }
                                    }
                                }
                            }
                        }

                        if (isValid != false && !strict && chrs != opts.radixPoint) {
                            var newPos = opts.postFormat(buffer, pos, false, opts);
                            return { "pos": newPos };
                        }

                        return isValid;
                    },
                    cardinality: 1,
                    prevalidator: null
                }
            },
            insertMode: true,
            autoUnmask: false
        },
        'integer': {
            regex: {
                number: function (opts) {
                    var escapedGroupSeparator = $.inputmask.escapeRegex.call(this, opts.groupSeparator);
                    var signedExpression = "[" + (opts.allowPlus ? "\+" : "") + (opts.allowMinus ? "-" : "") + "]?";
                    return new RegExp("^" + signedExpression + "(\\d+|\\d{1," + opts.groupSize + "}((" + escapedGroupSeparator + "\\d{" + opts.groupSize + "})?)+)$");
                }
            },
            alias: "decimal"
        }
    });
})(jQuery);
/*
Input Mask plugin extensions
http://github.com/RobinHerbots/jquery.inputmask
Copyright (c) 2010 - 2013 Robin Herbots
Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
Version: 2.3.17

Regex extensions on the jquery.inputmask base
Allows for using regular expressions as a mask
*/
(function ($) {
    $.extend($.inputmask.defaults.aliases, { // $(selector).inputmask("Regex", { regex: "[0-9]*"}
        'Regex': {
            mask: "r",
            greedy: false,
            repeat: "*",
            regex: null,
            regexTokens: null,
            //Thx to https://github.com/slevithan/regex-colorizer for the tokenizer regex
            tokenizer: /\[\^?]?(?:[^\\\]]+|\\[\S\s]?)*]?|\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9][0-9]*|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}|c[A-Za-z]|[\S\s]?)|\((?:\?[:=!]?)?|(?:[?*+]|\{[0-9]+(?:,[0-9]*)?\})\??|[^.?*+^${[()|\\]+|./g,
            quantifierFilter: /[0-9]+[^,]/,
            definitions: {
                'r': {
                    validator: function (chrs, buffer, pos, strict, opts) {

                        function analyseRegex() {
                            var currentToken = {
                                "isQuantifier": false,
                                "matches": [],
                                "isGroup": false
                            }, match, m, opengroups = [];

                            opts.regexTokens = [];

                            // The tokenizer regex does most of the tokenization grunt work
                            while (match = opts.tokenizer.exec(opts.regex)) {
                                m = match[0];
                                switch (m.charAt(0)) {
                                    case "[": // Character class
                                    case "\\":  // Escape or backreference
                                        if (currentToken["isGroup"] !== true) {
                                            currentToken = {
                                                "isQuantifier": false,
                                                "matches": [],
                                                "isGroup": false
                                            };
                                            opts.regexTokens.push(currentToken);
                                        }
                                        if (opengroups.length > 0) {
                                            opengroups[opengroups.length - 1]["matches"].push(m);
                                        } else {
                                            currentToken["matches"].push(m);
                                        }
                                        break;
                                    case "(": // Group opening
                                        currentToken = {
                                            "isQuantifier": false,
                                            "matches": [],
                                            "isGroup": true
                                        };
                                        opengroups.push(currentToken);
                                        break;
                                    case ")": // Group closing
                                        var groupToken = opengroups.pop();
                                        if (opengroups.length > 0) {
                                            opengroups[opengroups.length - 1]["matches"].push(groupToken);
                                        } else {
                                            currentToken = groupToken;
                                            opts.regexTokens.push(currentToken);
                                        }
                                        break;
                                    case "{": //Quantifier
                                        var quantifier = {
                                            "isQuantifier": true,
                                            "matches": [m],
                                            "isGroup": false
                                        };
                                        if (opengroups.length > 0) {
                                            opengroups[opengroups.length - 1]["matches"].push(quantifier);
                                        } else {
                                            currentToken["matches"].push(quantifier);
                                        }
                                        break;
                                    default:
                                        // Vertical bar (alternator) 
                                        // ^ or $ anchor
                                        // Dot (.)
                                        // Literal character sequence
                                        if (opengroups.length > 0) {
                                            opengroups[opengroups.length - 1]["matches"].push(m);
                                        } else {
                                            currentToken["matches"].push(m);
                                        }
                                }
                            }
                        };

                        function validateRegexToken(token, fromGroup) {
                            var isvalid = false;
                            if (fromGroup) {
                                regexPart += "(";
                                openGroupCount++;
                            }
                            for (var mndx = 0; mndx < token["matches"].length; mndx++) {
                                var matchToken = token["matches"][mndx];
                                if (matchToken["isGroup"] == true) {
                                    isvalid = validateRegexToken(matchToken, true);
                                } else if (matchToken["isQuantifier"] == true) {
                                    matchToken = matchToken["matches"][0];
                                    var quantifierMax = opts.quantifierFilter.exec(matchToken)[0].replace("}", "");
                                    var testExp = regexPart + "{1," + quantifierMax + "}"; //relax quantifier validation
                                    for (var j = 0; j < openGroupCount; j++) {
                                        testExp += ")";
                                    }
                                    var exp = new RegExp("^" + testExp + "$");
                                    isvalid = exp.test(bufferStr);
                                    regexPart += matchToken;
                                }
                                else {
                                    regexPart += matchToken;
                                    var testExp = regexPart.replace(/\|$/, "");
                                    for (var j = 0; j < openGroupCount; j++) {
                                        testExp += ")";
                                    }
                                    var exp = new RegExp("^" + testExp + "$");
                                    isvalid = exp.test(bufferStr);
                                }
                                if (isvalid) break;
                            }

                            if (fromGroup) {
                                regexPart += ")";
                                openGroupCount--;
                            }

                            return isvalid;
                        }


                        if (opts.regexTokens == null) {
                            analyseRegex();
                        }

                        var cbuffer = buffer.slice(), regexPart = "", isValid = false, openGroupCount = 0;
                        cbuffer.splice(pos, 0, chrs);
                        var bufferStr = cbuffer.join('');
                        for (var i = 0; i < opts.regexTokens.length; i++) {
                            var regexToken = opts.regexTokens[i];
                            isValid = validateRegexToken(regexToken, regexPart, regexToken["isGroup"]);
                            if (isValid) break;
                        }

                        return isValid;
                    },
                    cardinality: 1
                }
            }
        }
    });
})(jQuery);
