# auto_shared_piano
그냥 코로나 걸린 누군가가 할거 없어서 만든 뻘짓거리(였으나 여기에 올라오기까지 지속적인 개량(?)을 거쳐서 그 흔적은 거의 사라졌다고 함)
```js
element.dispatchEvent(new Event('mousedown'))
element.dispatchEvent(new Event('mouseup'))
```
이라는 매우매우 단순한 원리를 사용한다.

## 기본 사용법
사이트 링크: https://musiclab.chromeexperiments.com/Shared-Piano/

![image](https://user-images.githubusercontent.com/84973494/171174768-818c6f7c-84f1-42f0-9d40-4874174afa7a.png)   

들어가면 우선 이런 화면이 보인다.(컴퓨터 기준)   
사용법은 매우 단순하다. 그냥 보이는 건반을 마우스로 클릭하면 연주할 수 있다.   
`A`부터 `'`까지 도~높은파 흰 건반이고, 그 위쪽 키보드를 잘 누르면 검은 건반도 연주할 수 있다.

## 새 악보 생성하기
여기서부터는 코드를 다른 곳에 따로 복붙한 후 하자.   
(물론 위쪽 예시 악보부터 `note_list`가 있는 곳까지만 건들어야 한다.   
그 아래를 건들면 나중에 악보를 다 만들고 연주할 때 어떤 일이 벌어질 지 모른다.   
그리고 ~~쓸모없는~~ 예시 악보는 지워버리고 하면 편하다.)   
또한 자바스크립트를 조금이라도 할 수 있으면 ~~매우~~ 좋다.   
```js
var new_1 = ``
```
이렇게 새 악보를 만들어보자. 그 다음에는 ~~당연하게도~~ 예시 악보처럼 C4,D4같은 음을 넣어줘야 연주할 수 있다.   
그리고 아래 `var bpm = 120` 부분도 건들여서 만들 악보의 bpm에 맞게 뒤의 숫자를 바꾸어 주자. ~~안 바꾸면 이상해지니까 꼭 바꾸자~~

## 악보에 음 넣기
여기부터는 만든 사람 혼자 사용하려고 만든 거라 어려울 수 있다.   
우선 악보는 16분음표 단위로 적는다. ~~그래서 망할 셋잇단이 안된다. 망겜 수준~~   
`C4`, `D4`만 딸랑 적으면 그냥 16분음표로 인식돼서 매우 빠르게 연주되는 것을 볼 수 있다.   
`/`는 16분쉼표 1개 길이, `.`는 16분음표 4개 길이라 생각하면 된다.   
그러면 16분음표부터 온음표까지 만들어보자.   

<img src="https://user-images.githubusercontent.com/84973494/171177205-899e2cd8-900a-48aa-9c51-c5cfeeccdfd0.png" width='70px' height='70px'></img>   
`C4`: 평범한 16분음표다.

<img src="https://user-images.githubusercontent.com/84973494/171178033-69c174f2-c081-47c8-8a9b-f636e43c196b.png" width='70px' height='70px'></img>   
`C4.`: 평범한 8분음표다.

<img src="https://user-images.githubusercontent.com/84973494/171178188-92655438-1a8c-4390-95fc-45bec5c9b355.png" width='70px' height='70px'></img>   
`C4..`: 평범한 점8분음표다. 8분음표 + 16분음표이므로 뒤에 `.` 2개가 붙는다.   

<img src="https://user-images.githubusercontent.com/84973494/171178386-fc46ad9a-45ce-4c7f-8c90-5b410236b999.png" width='70px' height='70px'></img>   
`C4...`: 평범한 4분음표다. 은근 많아지면 악보가 매우매우 길어진다는 문제점이 있다.   

<img src="https://user-images.githubusercontent.com/84973494/171178494-e8c76f41-7167-4862-a17e-f187b99228f5.png" width='70px' height='70px'></img>   
`C4.'`: 평범한 점4분음표다. 4분음표 + 8분음표이므로 뒤에 `.` 5개가 붙는다.(`'` = `....`이다. 누가 왜 이렇게 만들었을까.)   

<img src="https://user-images.githubusercontent.com/84973494/171178658-9a07f0d5-ab79-4ed0-85d4-072ffdde008b.png" width='70px' height='70px'></img>  
`C4-`, 평범한 2분음표다. `-` = `.......`이다. 앞에 점4분음표부터 온음표까지는 붙임줄이랑 섞일 때 은근 헷갈린다.   

<img src="https://user-images.githubusercontent.com/84973494/171178896-626d8714-7a8a-4a62-8e67-ded02ef4f6d3.png" width='70px' height='70px'></img>   
`C4-'`: 평범한 점2분음표다. `-`와 `'`는 위치가 바뀌어도 상관없다.

<img src="https://user-images.githubusercontent.com/84973494/171179217-fc00ba80-6221-4193-9e57-c2983047b1e4.png" width='70px' height='70px'></img>   
`C4"`: 평범한 온음표다. `"`는 `.`가 15개 있는거라 생각하면 쉽다.   

`[C4E4G4]...` 등의 방법으로 화음도 만들 수 있다.   
`[]` 안에 연주할 음을 여러 개 넣고 위의 방법처럼 `.`이나 `/` 등을 넣어주면 된다.   
~~이거때문에 악보 처리하는 코드가 꼬였다.~~   

쉼표는 음표의 반대이다. `/`를 기준으로 `;`는 `/` 4개, `_`는 `/` 7개, `:`는 `/` 15개이다.   
추가로 `~`는 `/` 16개이다. 4분의 4박자 기준으로 한마디를 뭉탱이로 쉴 수 있다.   

`C4`에서 `C`는 도, `4`는 옥타브를 의미한다. 그런 원리로 당연히 `D4`는 레이다.   
추가로 `C#4`, `Db4`등으로 올림표와 내림표도 만들 수 있다.   
**내림표 기호가 알파벳 `b`를 사용하기 때문에 `b4` 등을 사용하면 악보가 꼬인다. 귀찮더라도 `B4` 등의 대문자를 사용하자.**   

## 악보 연주하기
이제 악보에 음을 넣었으면 악보를 연주해야 한다. 물론 악보를 여러 개 만들어서 왼손 오른손 하는 식으로 합칠 수도 있다.   
```js
var new_1 = `C4E4G4`
var new_2 = `C3E3G3`
```
이라는 악보를 ~~대충~~ 만들었다 해보자.   
`new_1`과 `new_2`를 동시에 연주하고 싶다면 아래쪽 `note_list`를   
```js
var note_list = [
    new_1, new_2
]
```
와 같이 만들 수 있다. 또한 `new_1` 다음에 `new_2`를 연주하고 싶다면 `+`를 사용해서
```js
var note_list = [
    new_1 + new_2
]
```
등과 같은 방법으로 연주할 수 있다.   
이제 `note_list`에 연주하고 싶은 악보들을 넣어줬으면 [위의 링크](https://musiclab.chromeexperiments.com/Shared-Piano/)에 들어가서   
F12를 눌러서 개발자 도구를 연 뒤 콘솔에 들어가서 위의 과정으로 만들어진 코드를 복붙해서 실행하면 된다.   

![image](https://user-images.githubusercontent.com/84973494/171182996-61948639-2ba3-466e-9c98-e95cda260e84.png)   
대충 연주가 시작되면서 이런 화면이 되면 성공(?)한 것이다.

## 기타
🎸   
뭘 바라신건가요?   

## 업데이트 기록
* 2022.06.01   

엄청난 귀차니즘을 뚫고 배포했다.   
이런 README.md같은거 만드는 게 은근 많이 귀찮다.
