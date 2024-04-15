// 전역 변수 선언
var finishOrder = []; // 게임 완료 순서를 저장할 배열
var playerCount = 0; // 게임에 참여한 플레이어 수
var distance_points = {}; // 각 플레이어의 이동 거리를 저장하는 객체        
var moveIntervals = {}; // 각 캐릭터의 인터벌 ID를 저장할 객체

// 문서가 준비되면 실행되는 함수
$(document).ready(function () {
    // 키보드의 키를 눌렀을 때 실행되는 이벤트 핸들러
    $(document).on('keydown', function (e) {
        if (e.key >= '1' && e.key <= '9') { // 키가 1부터 9 사이인 경우
            var keyNum = parseInt(e.key, 10); // 키의 숫자 값을 정수로 변환
            if (distance_points.hasOwnProperty(keyNum)) { // 해당 키 번호가 distance_points에 존재하는지 확인
                distance_points[keyNum] += 10; // 해당 플레이어의 이동 거리를 10 증가
                console.log("distance_point" + keyNum + ": " + distance_points[keyNum]); // 콘솔에 로그 출력
            }
        }
    });

    // "PLAY" 버튼을 클릭할 때 실행되는 이벤트 핸들러
    $("#play_btn").click(function () {
        for (var i = 1; i <= playerCount; i++) {
            clearInterval(moveIntervals["charactor" + i]); // 기존 인터벌 중지
            run("#charactor" + i, distance_points[i]); // 캐릭터에 대해 run 함수 실행
        }
    });

    // "플레이어 추가" 버튼을 클릭할 때 실행되는 이벤트 핸들러
    $("#play_add").click(function () {
        playerCount++; // 플레이어 수를 1 증가
        distance_points[playerCount] = 30; // 새 플레이어의 기본 이동 거리를 30으로 설정
        $("#contents").append(
            '<div id="rail_' + playerCount + '" class="rail">' +
            '   <div id="road' + playerCount + '" class="road">' +
            '       <div id="charactor' + playerCount + '" style="' +
            '           top: 50%;' +
            '           position: absolute;' +
            '           left: 0;' +
            '           width: 21px;' +
            '           height: 31px;' +
            '           background: url(\'./images/character_sprites.png\') no-repeat -331px -72px;' +
            '           transform: translateY(-50%);' +
            '       "></div>' +
            '   </div>' +
            '</div>'            
        );
    });
});



// 캐릭터를 움직이는 함수
function run(charctor, distance_point = 30) {
    // 캐릭터의 시작 위치를 도로의 시작점으로 초기화합니다.
    $(charctor).css({ left: '0px' });

    // 캐릭터가 위치한 도로의 전체 너비를 계산합니다.
    var roadWidth = $(charctor).parent().width();
    var currentPosition = 0; // 캐릭터의 현재 위치를 저장하는 변수를 초기화합니다.

    // 캐릭터의 스프라이트 이미지 프레임 정보입니다. 각 프레임은 다른 위치와 크기를 가집니다.
    var frames = [
        { x: -331, y: -72, width: 30, height: 34 },
        { x: -299, y: -74, width: 27, height: 31 },
        { x: -363, y: -74, width: 27, height: 31 }
    ];
    var currentFrame = 0; // 현재 사용중인 스프라이트 프레임의 인덱스를 저장하는 변수입니다.

    // 캐릭터를 움직이기 위한 인터벌을 설정합니다. 인터벌은 50밀리초마다 실행됩니다.
    moveIntervals[charctor.slice(1)] = setInterval(function () {
        // 현재 이동 거리에 무작위 값을 추가하여 움직임의 변화를 주고 더 리얼리틱하게 표현합니다.
        var randomStep = Math.random() * distance_point;
        currentPosition += randomStep;

        // 캐릭터가 도로의 끝에 도달했는지 확인합니다.
        if (currentPosition >= roadWidth - frames[currentFrame].width) {
            currentPosition = roadWidth - frames[currentFrame].width; // 캐릭터 위치를 도로 끝으로 설정합니다.
            clearInterval(moveIntervals[charctor.slice(1)]); // 도달했다면 이동 인터벌을 중지합니다.
            finishOrder.push(charctor.slice(1)); // 완주한 캐릭터의 ID를 순위 배열에 추가합니다.
            updateRankBoard(); // 순위판을 업데이트하는 함수를 호출합니다.
        }

        // 캐릭터의 스타일을 업데이트하여 화면상의 위치를 변경합니다.
        $(charctor).css({
            left: currentPosition + 'px', // 캐릭터의 좌표를 업데이트
            'background-position': `${frames[currentFrame].x}px ${frames[currentFrame].y}px` // 사용할 스프라이트 이미지의 위치를 조정
        });

        // 다음 프레임으로 이동하거나, 마지막 프레임이면 첫 번째 프레임으로 돌아갑니다.
        currentFrame = (currentFrame + 1) % frames.length;
    }, 50); // 50밀리초마다 실행
}

// 순위판을 업데이트하는 함수
function updateRankBoard() {
    var rankText = finishOrder.map((charactor, index) => { // finishOrder 배열을 순회하며 순위 문자열 생성
        return (index + 1) + "등: " + charactor; // 순위와 캐릭터 ID로 문자열 조합
    }).join("<br>"); // 각 순위를 줄바꿈 문자로 연결
    $("#rank_board").html(rankText); // 순위판에 순위 문자열을 HTML로 설정
    if (finishOrder.length === playerCount) { // 모든 플레이어가 도착했는지 확인
        finishOrder = []; // finishOrder 배열 초기화
    }
}       
