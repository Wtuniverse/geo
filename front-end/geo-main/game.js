function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371; // 地球半径，单位为千米

    // 将经纬度从度数转换为弧度
    const radiansLat1 = (lat1 * Math.PI) / 180;
    const radiansLon1 = (lon1 * Math.PI) / 180;
    const radiansLat2 = (lat2 * Math.PI) / 180;
    const radiansLon2 = (lon2 * Math.PI) / 180;

    // Haversine公式
    const dLat = radiansLat2 - radiansLat1;
    const dLon = radiansLon2 - radiansLon1;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(radiansLat1) * Math.cos(radiansLat2) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // 计算距离
    const distance = earthRadius * c;

    return distance;
}
function calculateGrade(distance){
    g = 6666/distance
    return g    
}

function selectpi(){
    positions = [[117.2691737046815,39.05336918618843],
                 [113.61842294073212,37.871254165653646],
                 [111.16343125780934,37.53166541771748],
                 [116.48538778524059,39.98867148202242],
                 [117.32624835250105,39.16229306902295],
                 [117.1884625452086,39.252609644117285],
                 [116.11335982892288,38.991426140843004],
                 [115.46311316259512,38.88637846472794],
                 [115.36647336348405,38.95374480025823],
                 [115.36495048117531,38.94356534883398],
                 [114.5145023627212,38.08694050583679],
                 [114.48507518434191,38.09083103053785],
                 [114.44451918213916,38.090323582635406],
                 [114.44141595241915,38.070953332668836],
                 [114.33557404535104,38.07957311582709],
                 [114.38611849856454,38.03152618932309],
                 [114.34454595441935,38.00386381685282],
                ]
    rindex = Math.floor(Math.random() * positions.length); // 生成一个随机索引
    element = positions[rindex]
    plo = element[0]
    pla = element[1]
}




function confirm(){                              //确定按钮
    if(turn>=outturn){
        let totalScore = grades.toFixed(0);
        alert("总得分为" + totalScore);

        const token = localStorage.getItem('jwtToken'); // 从LocalStorage中获取token
        axios.post('http://localhost:3000/updateScore', {
            score: totalScore
        }, {
            headers: {
                Authorization: 'Bearer ' + token  // 将token添加到请求头
            }
        })
        .then(response => {
            let code = response.data.code;
            if (code == -1 || code == -2) {
                window.location.href = '../index.html';
            } else if (code == 1) {
                window.location.href = '../home.html';
            } else {
                alert(response.data.msg);
            }
        })
        .catch(error => {
            // 处理错误
            console.error(error);
        });

    }       
    else if(mla == ""){
        alert("请先在地图上点击你认为该地的地理位置，再按确定")
    }else{
        x = calculateDistance(pla, plo, mla, mlo).toFixed(3)
        y = calculateGrade(x).toFixed(0)
        turn += 1
        grades += calculateGrade(x)
        alert("距离所在位置"+x+"公里,得分为"+y)
        selectpi()
        panorama.setPosition(new BMapGL.Point(plo, pla))
    }
}
function again(){       //还没用到
    if(turn>=outturn){
        window.location.reload()
    }
}