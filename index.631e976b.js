const e={inputForm:document.querySelector("#search-form"),inputField:document.querySelector("input"),searchButton:document.querySelector("button"),galleryItems:document.querySelector(".gallery"),continuouButton:document.querySelector(".load-more"),moviesDiv:document.querySelector("#movies"),paginationDiv:document.querySelector("#pagination"),preButton:document.querySelector(".previous"),nextButton:document.querySelector(".next")};let t=0,o=1;async function n(){const t=await async function(){let e=[];try{const t=await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=06cf6ee022a0922eb5200ae030143d7b&page=${o}`);e=await t.json()}catch(e){console.log(e)}return e}();console.log(t),console.log(t.results),e.moviesDiv.innerHTML=t.results.map((e=>function(e){return` <div class="col-4 col-lg-3 col-xl-2 p-1">\n            <img src="${"https://image.tmdb.org/t/p/w1280"+e.poster_path}" class="img-fluid" >\n        </div>`}(e))).join(""),e.paginationDiv.innerHTML=r().map((e=>`<button type='submit' value='${e}'>${e}</button>`)).join("")}function r(){const e=[];for(let o=t;o<t+10;o+=1)e.push(o+1);return e}IMAGE_BASE_URL="https://image.tmdb.org/t/p/w1280",e.inputForm.addEventListener("submit",(function(t){t.preventDefault(),n(),e.preButton.classList.remove("hidden"),e.nextButton.classList.remove("hidden"),console.log(t.currentTarget.elements.searchQuery.value)})),e.paginationDiv.addEventListener("click",(function(e){e.preventDefault(),console.log(e.target.value),o=Number(e.target.value),n(),o=o%10==0?o-10+1:Math.floor(o-o%10+1);console.log(o)})),e.nextButton.addEventListener("click",(function(){o+=10,t+=10,console.log("current page=",o),console.log("start page=",t),r(),n()})),e.preButton.addEventListener("click",(function(){if(t-=10,console.log("start page=",t),t<0)return void(t=0);o-=10,console.log("current page=",o),r(),n()}));
//# sourceMappingURL=index.631e976b.js.map
