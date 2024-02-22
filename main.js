const API_KEY ='af227da480994f1b9fa6c3a1b1b23578';
let newsList=[];
const menus = document.querySelectorAll("#menu-list button")
menus.forEach((menu)=>menu.addEventListener("click",(event)=>getNewsByCategory(event)))

//let url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`)
let url = new URL(`https://escookienewstimes.netlify.app/top-headlines`)
let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;
const svgElement = document.querySelector('.head-line svg');
const main = document.querySelector('.head-line');

const imgError = (image) => {
	image.onerror = null; // 이미지 에러 핸들러를 중복 호출하지 않도록 이벤트 리스너를 제거합니다.
	image.src = "images/no-image.jpg";
};


svgElement.addEventListener('click', () => getLatestNews());
main.addEventListener('mouseover', () => { main.style.cursor = "pointer" });
main.addEventListener('mouseout', () => { main.style.cursor = "auto" });

const getNews =async() =>{
    try{
        url.searchParams.set("page", page);
        url.searchParams.set("pageSize", pageSize);
        const response = await fetch(url);        
        //console.log(response)
        const data = await response.json();
        if(response.status===200){
            if(data.articles.length===0){
                throw new Error("No result for this search")
            }
            newsList = data.articles;
            totalResults = data.totalResults
            render();
            paginationRender();
        }else{
            throw new Error(data.message)
        }
        
    }catch(error){
        errorRender(error.message);
    }
    
}

const getLatestNews = async () =>{
    //url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`);
    url = new URL(`https://escookienewstimes.netlify.app/top-headlines`);        
    getNews();
}

const getNewsByCategory = async (event)=>{    
    const category = event.target.textContent.toLowerCase();
    console.log("category",category)
    //url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`)
    url = new URL(`https://escookienewstimes.netlify.app/top-headlines?category=${category}`)
    getNews();
};

const openSearchBox = () => {
    let inputArea = document.getElementById("input-area");
    if (inputArea.style.display === "inline") {
      inputArea.style.display = "none";
    } else {
      inputArea.style.display = "inline";
    }
  };

const getNewsByKeyword = async() =>{
    const keyword = document.getElementById("search-input").value;
    //url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&q=${keyword}&apiKey=${API_KEY}`)
    url = new URL(`https://escookienewstimes.netlify.app/top-headlines?q=${keyword}`)
    getNews();
}

const render=()=>{
    const newsHTML = newsList.map(news=>`
    <div class="row news">
    <div class="col-lg-4">
        <img class="news-img-size" src=${news.urlToImage} onerror="imgError(this)">
    </div>
    <div class="col-lg-8 content">
        <h2>${news.title}</h2>
        <p>${
            news.description == null || news.description == ""
              ? "내용없음"
              : news.description.length > 200
              ? news.description.substring(0, 200) + "..."
              : news.description
          }</p>
          <div>${news.source.name || "no source"}  ${moment(
            news.publishedAt
          ).fromNow()}</div>
        <div>
            ${news.source.name} * ${news.publishedAt}
        </div>
    </div>
    </div>`
    )
    .join("");    
    document.getElementById('news-board').innerHTML = newsHTML;
}


const errorRender = (errorMessage) => {
    const errorHTML = `<div class="alert alert-danger text-center" role="alert">
  ${errorMessage}
</div>`;
    document.getElementById("news-board").innerHTML=errorHTML
}

const paginationRender=()=>{
    
    const totalPages = Math.ceil(totalResults/pageSize);
    
    const pageGroup = Math.ceil(page/groupSize);
    
    let lastPage = pageGroup * groupSize;
    if(lastPage > totalPages){
        lastPage = totalPages;
    }
    
    const firstPage = lastPage - (groupSize-1)<=0? 1: lastPage - (groupSize-1);//이 결과값이 0보다 작거나 같으면 무조건 1로 해주세요, 그게 아니라면 lastPage - (groupSize-1) 요 수식을 걸어주세요
    ////////////
    let paginationHTML = `
    <li class="page-item" onclick="moveToPage(1)"><a class="page-link">&lt;&lt;</a></li>
    <li class="page-item" onclick="moveToPage(${page-1})"><a class="page-link">&lt;</a></li>`
   
    for(let i=firstPage; i<=lastPage; i++){
        paginationHTML += `<li class="page-item ${i===page?'active':''}" onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`
    }
    
    paginationHTML += `
    <li class="page-item" onclick="moveToPage(${page+1})"><a class="page-link">&gt;</a></li>
    <li class="page-item" onclick="moveToPage(${totalPages})"><a class="page-link">&gt;&gt;</a></li>`
    //////////
    document.querySelector(".pagination").innerHTML = paginationHTML

};

const moveToPage=(pageNum)=>{
    page = pageNum;
    getNews();
}

const openNav = () => {
    document.getElementById("mySidenav").style.width = "250px";
  };
  
  const closeNav = () => {
    document.getElementById("mySidenav").style.width = "0";
  };


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

getLatestNews();

