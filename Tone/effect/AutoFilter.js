define(["Tone/core/Tone", "Tone/effect/Effect", "Tone/component/LFO", "Tone/component/Filter"], function(Tone){

	"use strict";

	/**
	 *  @class AutoFilter is a Tone.Filter with an LFO connected to the filter cutoff frequency.
	 *
	 *  @constructor
	 *  @extends {Tone.Effect}
	 *  @param {Tone.Time} [frequency=1] (optional) rate in HZ of the filter
	 *  @param {number} [min=200] min 
 	 *  @param {number} [max=1200] max
	 *  @example
	 *  var autoFilter = new Tone.AutoFilter("4n");
	 */
	Tone.AutoFilter = function(){

		var options = this.optionsObject(arguments, ["frequency", "min", "max"], Tone.AutoFilter.defaults);
		Tone.Effect.call(this, options);

		/**
		 *  the lfo which drives the filter cutoff
		 *  @type {Tone.LFO}
		 *  @private
		 */
		this._lfo = new Tone.LFO(options.frequency, options.min, options.max);

		/**
		 * The range of the filter modulating between the min and max frequency. 
		 * 0 = no modulation. 1 = full modulation.
		 * @type {Tone.Signal}
		 */
		this.depth = this._lfo.amplitude;

		/**
		 * How fast the filter modulates between min and max. 
		 * @type {Tone.Signal}
		 */
		this.frequency = this._lfo.frequency;

		/**
		 *  the filter node
		 *  @type {Tone.Filter}
		 *  @private
		 */
		this._filter = new Tone.Filter(options.filter);

		//connections
		this.connectEffect(this._filter);
		this._lfo.connect(this._filter.frequency);
		this.type = options.type;
		this._readOnly(["frequency", "depth"]);
	};

	//extend Effect
	Tone.extend(Tone.AutoFilter, Tone.Effect);

	/**
	 *  defaults
	 *  @static
	 *  @type {Object}
	 */
	Tone.AutoFilter.defaults = {
		"frequency" : 1,
		"type" : "sine",
		"depth" : 1,
		"min" : 200,
		"max" : 1200,
		"filter" : {
			"type" : "lowpass",
			"rolloff" : -12,
			"Q" : 1,
		}
	};
	
	/**
	 * Start the filter.
	 * @param {Tone.Time} [time=now] the filter begins.
	 * @returns {Tone.AutoFilter} `this`
	 */
	Tone.AutoFilter.prototype.start = function(time){
		this._lfo.start(time);
		return this;
	};

	/**
	 * Stop the filter.
	 * @param {Tone.Time} [time=now] the filter stops.
	 * @returns {Tone.AutoFilter} `this`
	 */
	Tone.AutoFilter.prototype.stop = function(time){
		this._lfo.stop(time);
		return this;
	};

	/**
	 * Sync the filter to the transport.
	 * @param {Tone.Time} [delay=0] Delay time before starting the effect after the
	 *                               Transport has started. 
	 * @returns {Tone.AutoFilter} `this`
	 */
	Tone.AutoFilter.prototype.sync = function(delay){
		this._lfo.sync(delay);
		return this;
	};

	/**
	 * Unsync the filter from the transport
	 * @returns {Tone.AutoFilter} `this`
	 */
	Tone.AutoFilter.prototype.unsync = function(){
		this._lfo.unsync();
		return this;
	};

	/**
	 * Type of oscillator attached to the AutoFilter.
	 * @memberOf Tone.AutoFilter#
	 * @type {string}
	 * @name type
	 */
	Object.defineProperty(Tone.AutoFilter.prototype, "type", {
		get : function(){
			return this._lfo.type;
		},
		set : function(type){
			this._lfo.type = type;
		}
	});

	/**
	 * The miniumum output of the AutoFilter.
	 * @memberOf Tone.AutoFilter#
	 * @type {number}
	 * @name min
	 */
	Object.defineProperty(Tone.AutoFilter.prototype, "min", {
		get : function(){
			return this._lfo.min;
		},
		set : function(min){
			this._lfo.min = min;
		}
	});

	/**
	 * The maximum output of the AutoFilter.
	 * @memberOf Tone.AutoFilter#
	 * @type {number}
	 * @name max
	 */
	Object.defineProperty(Tone.AutoFilter.prototype, "max", {
		get : function(){
			return this._lfo.max;
		},
		set : function(max){
			this._lfo.max = max;
		}
	});

	/**
	 *  clean up
	 *  @returns {Tone.AutoFilter} `this`
	 */
	Tone.AutoFilter.prototype.dispose = function(){
		Tone.Effect.prototype.dispose.call(this);
		this._lfo.dispose();
		this._lfo = null;
		this._filter.dispose();
		this._filter = null;
		this._writable(["frequency", "depth"]);
		this.frequency = null;
		this.depth = null;
		return this;
	};

	return Tone.AutoFilter;
});