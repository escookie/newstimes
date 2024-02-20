const API_KEY ='af227da480994f1b9fa6c3a1b1b23578';
let newsList=[];
const menus = document.querySelectorAll(".menus button")
menus.forEach(menu=>menu.addEventListener("click",(event)=>getNewsByCategory(event)))

// 이벤트 핸들러 함수 추가
const searchInput = document.getElementById("search-input");
searchInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        getNewsByKeyword();
    }
});

// 검색 창 클릭 시 내용 지우기
searchInput.addEventListener("click", function() {
    this.value = ""; // 검색 창의 값 비우기
});

const getLatestNews = async () =>{
    // const url = new URL(
    //     `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`
    //     );
    const url = new URL(
        `http://times-node-env.eba-appvq3ef.ap-northeast-2.elasticbeanstalk.com/top-headlines`
        );        
    const response = await fetch(url);
    const data = await response.json();
     newsList = data.articles;
     render();
    //console.log("ddd",newsList);
}

const getNewsByCategory = async (event)=>{    
    const category = event.target.textContent.toLowerCase();
    console.log("category",category)
    // const url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`)
    const url = new URL(`http://times-node-env.eba-appvq3ef.ap-northeast-2.elasticbeanstalk.com/top-headlines?category=${category}`)
    const response = await fetch(url)
    const data = await response.json()
    console.log("dd",data)
    newsList = data.articles;
    render()
};

const getNewsByKeyword = async() =>{
    const keyword = document.getElementById("search-input").value;
    //console.log("keyword",keyword)
    //const url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&q=${keyword}&apiKey=${API_KEY}`)
    const url = new URL(`http://times-node-env.eba-appvq3ef.ap-northeast-2.elasticbeanstalk.com/top-headlines?q=${keyword}`)
    const response = await fetch(url)
    const data = await response.json()
    //console.log("keyword data",data)
    newsList = data.articles;
    render()
}


const render=()=>{
    const newsHTML = newsList.map(news=>`<div class="row news">
    <div class="col-lg-4">
        <img class="news-img-size" src=${news.urlToImage}>
    </div>
    <div class="col-lg-8 content">
        <h2>${news.title}</h2>
        <p>
            ${news.description}
        </p>
        <div>
            ${news.source.name} * ${news.publishedAt}
        </div>
    </div>
</div>`
    )
    .join("");
    //console.log("html",newsHTML)
    
    document.getElementById('news-board').innerHTML = newsHTML;
}
getLatestNews();