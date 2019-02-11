#1px.js javascript framework

## Working Drafts


### @TODO

```html
- array as item, index => item if item.completed /// if filter 구현하기
- allMarked = !num_left /// assignment 구현하기 (expression but only root!!)
- parse.js => 상수 cache ex) ['abc','def',2] or 100 + 400 * 2 등등..
- $ `num_completed = (todos as todo if todo.completed).length` /// $ 구현하기, format 생각하기
- {{ textData | html }} 이거 구현!!
```


### 원칙과 목표

- 덩치를 키우지 않는다. 
- 프레임워크를 쓰기 위해 프레임워크에 맞게 기존 코드를 고치는 것을 최소화 한다.
- => 프레임워크를 사용하기 위한 포맷을 최소화 할것 (그래서 모듈이 고민이다.) 
- 간단하고 직관적이고 쉬워야 한다.



### Complie (Simple)

```html
<template id="el">
    <h1>{{ title }}</h1>
</template>

<scrpit>
let el = module.compile("#el", {
	title: "hello world"
});
</scrpit>
```


### Template Syntax

```html
<!-- property, interpolation -->
<div [hidden]="isShow">{{ todo.title }}</div>

<!-- event -->
<button (click)="hello()">

<!-- class -->
<button [class.hello]="bool">

<!-- attr -->
<button [attr.id]="this.id">

<!-- style -->
<button [style.width.px]="img.width" [style.background-image.url]="'abc.jpg'">

<!-- two-way -->
<input [(value)]="title">

<!-- ref -->
<div $div>{{ $div.tagName }}</form>
```




### Template Syntax - If

```html
<!-- if -->
<div *if="condition"></div>

<div *else-if="condition2"></div>

<div *else></div>
```


### Template Syntax - Repeat

```html
<!-- maniplation -->
<div *foreach="todos as todo, index"></div>

<!-- map, filter -->
<div *foreach="todos as todo, index => todo.title if todo.complete"></div>
```



### Template Syntax - With (Draft)
```html
<section *with="100 + 200 * c as value">
    <div>{{ value }}</div>
    <div>{{ value + 100 }}</div>
</section>
```




### Template Syntax - Event

```html

.prevent
.capture
.stop
.self
.once

with Observerable??? | pipe???

```


### Template Syntax - Event with Observable (Draft)
```html
<button (click$)="$.mapTo(event).delay(1000).debounce(1000).do(abc)"></div>

<button (click$.assign)="myObservable$"></div>

<button (click$)="myObservable$"></div>

<script>
    this.myObservable$.delay(100).subscribe(event => foo(event))
</script>
```





### Event Handler with Promise (or Obserable)
```html
    click() {
    	/// do stuff...
        
        /// pending... 	
    	return fetch("....").then( ... );
    }
    
    or ...

    click() {
    	/// do stuff...
        
        /// pending... 	
    	return new Observable(observer => {
    		
    		....
    		
    		observer.complete();
    	})
    }
```





### Pipe
```html
<div>{{ today | date: 'yyyy-mm-dd' }}</div>
```




### Smart Watch

```javascript

$ `this.num_completed = todos.filter(todo => todo.completed).length`

```


### Module
```javascript

module.value("count", 0)

module.factory("mylib", function(http, element) { ... })

module.require(function(http, element) { ... })

///

module.component();

module.service();

module.pipe();


```

### WebComponent

```html

<todo-apps></todo-apps>

<web-component name="todo-apps" (click)="hello()">
    <template>
        <div *repeat="todos as todo">{{ todo.title }}</div>   
    </template>

    <template *if="multiple">
        <div *repeat="todos as todo">{{ todo.title }}</div>   
    </template>
</web-component>

or

<template *as="todo-apps" (click)="hello()">
    <div *repeat="todos as todo">{{ todo.title }}</div>   
</template>

<script>module.component("todo-apps", function() {
	
	return {
		init() {
			
		},
		
		addTodos(title) {
			
		}
	}
})

</script>
```



### WebComponent - content & slot

```html
<web-component name="my-btn" replace="true">
    <template>
        <button><content></content></button>   
    </template>
</web-component>

<my-btn>hello world</my-btn>
```




### Observable
```javascript
let o = Observable.of(1, 2, 3).subscribe(v => v);
```
### Expression

```html
$parse(script).watch$(global, local);

let scope = new Scope(global, local);

scope.watch$(script)

```


### Service
```html
Watcher와 Module를 결합한 선언형 프로그래밍 모듈.

<web-component>
    <!-- Service -->
    <http url="/api/todos" [params]="params" $http></http>
    
    <template>
        <div *repeat="$http.res as page"></div>
    </template>
</web-component>
```


### Form

```html
<form>
    <input type="text" [(value)]="title">

    <input type="text" [(value.change)]="title">

    <input type="checkbox" [(checked)]="bool">

    <input name="m" type="checkbox" value="A" [(checked.multiple)]="array">
    <input name="m" type="checkbox" value="B" [(checked.multiple)]="array">
    <input name="m" type="checkbox" value="C" [(checked.multiple)]="array">
</form>
``` 



### Form - Validate (Draft)

```html
.ng-unmodified
.ng-untouched
.ng-touched
.ng-dirty
.ng-valid
.ng-invalid
.ng-pending
``` 



 
 
### Animation (DOM Transition)
 
 
### Router
```html
- PageJs
https://github.com/visionmedia/page.js

page('/user/:id', this.prepare, this.userId, ... )
page('*', notFound)

userId(ctx, next) {
    ctx.params.id;
    fetch(...).then(res => {
        ...
        next()
    ));
]
```



### Virtual DOM
```html
개인적으로 Virtual DOM 은 좋아하지 않는다. 성능이 별로다. 
SSR을 고려했을때 처음 딱 1번만 Virtual DOM으로 업데이트 하는 방법을 생각해보자.
```

### SSR & Universal on ServerSide
```html
express와 Node.js 를 이용해서 Universal을 만들 방법을 생각해보자.

- Server에서 사용되는 Component와 Client에서 사용하는 컴포넌트 분리

- Server Data가 연동되는 것 ex) blogs, boards 등은 그냥 html을 통째로 받아서 Virtual DOM 하자.

- URL Request 할떄마다 새로 페이지를 만드는게 아니라 DB 등이 변경되면 Store에 HTML을 보관하고 즉시 뿌려주는 방식

- Account등과 같이 개인적인 페이지는 Client Component를 이용하자.

- **Point: 모든 페이지는 동일한 정적 구조를 항시 유지한다. 
=> account의 정보와 같이 접근하는 사람마다 다른 페이지일 경우에만 client 사용
```


### UI Library



### more Things

```html

내가 작업하면서 힘들었던 것들.. ==> 개발 필요!!!

- cart등에서 qty 등이 바뀌었을때 새로고침하는거 => 이제는 해결 watch script에 function map filter 추가

- touch, drag & drop 등 motion Event Helper

- url Parsing => page.js 참고해서 잘 만들어 보자.

- iframe Widget

- input text format -> number, date, phone, etc....

- Loading Progress UI with Promise, Observable
=> 이거 번쩍 번쩍 하거나, 2중 로딩이 있거나 이런거 자동으로 예쁘게 처리


- Data Base Framework with (Rest API)

- {{ tags | highlight: currentTags | html }} 이런거~~~ 텍스트 표시자에서 html 출력하는 기능

- 카트 자동 계산은 진짜 죽음이었지 ㅠㅠ

- account 모듈







```

### localStorage or Firebase Storage ....
```html

ex) localStorage always save with Proxy handler!!!!


```


### Touch & Drag & Drop & Motion Event ....






