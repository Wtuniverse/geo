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

var countdown; // 用于存储倒计时的变量
var timer = 120; // 倒计时时间，单位为秒（2分钟）
var isConfirmed = false; // 用于跟踪是否已经点击了确认按钮

function startTimer() {
    countdown = setInterval(function() {
        var minutes = parseInt(timer / 60, 10);
        var seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        document.getElementById('timer').textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = 0;
            clearInterval(countdown);
            console.log(isConfirmed);
            if (!isConfirmed) {
                console.log("倒计时结束")
                confirm(); // 倒计时结束时调用confirm函数
            }
        }
    }, 1000);
}

function checkbtn() {
    isConfirmed = true;
}

function resetTimer() {
    timer = 120; // 重置时间为2分钟
    isConfirmed = false;
    startTimer(); // 重新开始倒计时
    console.log("重新开始倒计时");
}

function confirm() {
    if(!isConfirmed && mla == "") {
        x = " "
        y = 0; // 如果是因为倒计时结束调用的confirm，则设置得分为0
        console.log(y);
    } else if (isConfirmed && mla == "") {
        alert("Please click on the map where you think the location is, and then click OK")
        isConfirmed = false;
        return;
    } else {
        x = calculateDistance(pla, plo, mla, mlo).toFixed(3)
        y = calculateGrade(x).toFixed(0)
    }
    if (isConfirmed) {
        clearInterval(countdown); // 清除现有的计时器
        isConfirmed = false;
    }
    if(turn>=outturn){
        clearInterval(countdown); // 清除现有的计时器
        grades += parseInt(y);
        alert("The distance is "+x+" kilometers,you scores is "+y)
        alert("The total scores is "+grades.toFixed(0))

        const token = localStorage.getItem('jwtToken'); // 从LocalStorage中获取token
        axios.post('http://localhost:3000/updateScore', {
            score: grades
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

    }else{
        turn += 1
        grades += parseInt(y);
        console.log(grades);
        alert("The distance is "+x+" kilometers,you scores is "+y)
        selectpi()
        panorama.setPosition(new BMapGL.Point(plo, pla))
        resetTimer(); // 在设置新位置后重置倒计时
    }
}

startTimer(); // 开始倒计时


function again(){       //还没用到
    if(turn>=outturn){
        window.location.reload()
    }
}