# TypeScript基本操作



## 一、声明数据模型

接下来我们可以写一个`todoItem.ts`：

```typescript
export class TodoItem{
    public id:number;
    public task:string;
    public complete:boolean = false;

    public constructor(id:number,task:string,complete:boolean=false){
        this.id = id;
        this.task = task;
        this.complete = complete;
    }
    public printDetails():void{
        console.log(`${this.id}\t${this.task} ${this.complete
            ? "\t(complete)": ""}\t`);
    }
}
```

上边的写法和C#, Java的写法很相似，但还可以利用TypeScript的特性进行简化，简化后如下：

```typescript
export class TodoItem{

    constructor(public id:number,
                public task:string,
                public complete:boolean=false){ }
    
                printDetails():void{
        console.log(`${this.id}\t${this.task} ${this.complete
            ? "\t(complete)": ""}\t`);
    }
}
```

在TypeScript中，如果属性和方法定义前边没有访问控制关键字（比如：private, protected），则默认为public。

接下来我们再写一个todoCollection.ts

```typescript
import { TodoItem } from "./todoItem";

export class TodoCollection{
    private nextId:number = 1;

    constructor(public userName:string,
                public todoItems:TodoItem[] = []){ }

    addTodo(task:string):number{
        while(this.getTodoById(this.nextId)){
            this.nextId++;
        }
        this.todoItems.push(new TodoItem(this.nextId, task));
        return this.nextId;
    }

    getTodoById(id:number):TodoItem{
        return this.todoItems.find(item => item.id == id);
    }
    
    markComplete(id:number,complete:boolean){
        const todoItem = this.getTodoById(id);
        if(todoItem){
            todoItem.complete = complete;
        }
    }
}
```

覆盖`index.ts`如下：

```typescript
import { TodoCollection } from "./todoCollection";
import { TodoItem } from "./todoItem";

let todos:TodoItem[] = [
    new TodoItem(1, "Buy Flowers"),
    new TodoItem(2, "Get Shoes"),
    new TodoItem(3, "Collect Tickets"),
    new TodoItem(4, "Call Joe", true)
];

let collection:TodoCollection = new TodoCollection("Adam", todos);

console.clear();
console.log(`${collection.userName}'s Todo List`);

let newId:number = collection.addTodo("Go for run");
let todoItem:TodoItem = collection.getTodoById(newId);

todoItem.printDetails();
console.log(JSON.stringify(todoItem));
```

`import`命令声明了依赖项，这个是JavaScript的特性



## 二、给类添加更多功能

