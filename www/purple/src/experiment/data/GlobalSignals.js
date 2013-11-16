define(['signals'], function(signals) {
    var globalSignals =  {
        particlesAppeared: new signals.Signal(),
        trianglesAppeared: new signals.Signal(),
        lineAppeared: new signals.Signal(),
        letterWidthChanged: new signals.Signal(),
        letterHeightChanged: new signals.Signal(),
        letterSpacingChanged: new signals.Signal(),
        morphingCompleted: new signals.Signal(),
        textTransformCompleted: new signals.Signal(),
        experimentStarted: new signals.Signal()
    };

    return globalSignals;
});