require.config({
    baseUrl: 'js/lib',
    paths: {
        app: '../app'
    },

    shim: {
        three: {
            exports: 'three'
        },
        ParticleEngine: {
            deps: ["three"],
            exports: 'ParticleEngine'
        },
        Stats: {
            exports: 'Stats'
        },
        TweenMax: {
            exports: "TweenMax"
        },
        TimelineMax: {
            deps: ["TweenMax"],
            exports: "TimelineMax"
        }
    },

    deps: ['three', 'ParticleEngine', 'TweenMax', 'TimelineMax']
});

require(['app/app'], function(App) {
    window.app = new App();
});