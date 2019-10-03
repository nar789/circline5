        $(function() {
          subtitleAnimation();
          splashInit();
          goPage("login");
        });

       function subtitleAnimation(){
        $(".subtitle").animate({
            opacity:'1',
            top:'11rem'
          },3000);
       }

       function goPage(page){
          setTimeout(()=>{
            location.replace(page);
          },5000);
       }

       function splashInit()
       {
          const curry = f => (...args) =>
          args.length >= f.length
            ? f(...args)
            : curry(f.bind(f, ...args))
            
          const compose = (f, g) => x => f(g(x))
          const composeN = (...fns) => (...args) =>
            fns.reverse()
              .reduce((x, f) => f.apply(f, [].concat(x)), args)
       }