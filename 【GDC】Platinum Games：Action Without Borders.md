# 【GDC】Platinum Games：Action Without Borders
2020-01-08

## What is an Action Game?

- A set of actions responding to output 玩家对游戏的每一个输出结果进行一系列动作反应
  - Passive activity 被动行为
    - This sounds like the exact opposite of action 听起来和传统动作游戏的观念完全相反

- Activity based on prior (active) input 基于优先输入的活动
  - Adventure/Horror games 冒险游戏/恐怖游戏
    - This is opposite to the impression horror games give off 这和恐怖游戏传达的信息正好相反
- What are "action skills"? 什么是动作技巧
  - The player's ability to deal with a given situation 玩家处理给定情景的能力

## Gameplay Systems

- What are gameplay systems?
  - The selling point of a game 游戏的卖点
    - The unique elements that define a game 一款游戏由它的独一无二的元素定义
  - Expanding features 持续加入的特点
    - Lateral expansion to prevent games from becoming too linear 特点多（特点宽度宽）可以防止游戏变得太线性。
  - Depth 深度
- If a game has selling points A/B/C, expanding features D/E, and depth elements F/G:
如果一个游戏的卖点有ABC,横向特点有DE,深度特点有FG
  - Players complete the game having experienced A and B
  玩家通关，体验到了AB
    - They've completed and enjoyed the game
    这时他们认为是打完了，并且乐在其中
  - Players complete the game having experienced A,B, and C
  玩家通关，体验到了ABC
    - They've completed the game and feel like they got a lot of it
    这时他们认为是打完了，并且得到了大量满足
  - Players complete the game having experienced A,B,C and D
  玩家通关体验到了ABCD
    - They've complete the game, and become good at it in a variety of ways
    他们认为是打完了，并且擅长用多种方式通关
  - Players complete the game having experienced A,B,C,D and E
  玩家通关体验到了ABCDE
    - "Wow! I didn't know you could do that! This game is awesome!!"
    玩家：“哇，没想到还可以这样，这游戏棒极了”
  - Players complete the game having experienced A,B,C,D,E and F
  玩家通关体验到了ABCDEF
    - "I am a god among mortals!"
    玩家：“本大神在这，你们这群菜鸡”
- How to approach the selling points of an action game 如何提取动作游戏的卖点
  - It's not about functional design 不是特点设计
    - The question "What abilities shall we give the player?" never comes first
    “我们应该赋予玩家什么样的能力”从来不是第一个要考虑的
  - It's about situational design 而是情景设计
    - The first thing to figure out is: "What kind of situations do we put the player in, and what are we going to make them do?"
    首先要搞清楚的是“我们应该把玩家放进什么情景里？然后我们要让玩家在这个情景里做什么？”
- One more important things about the design of selling points: 最后一个重要点是卖点设计
  - When creating a game in a series, you already have an existing ability set to work with ,so:
  在游戏研发流水线中，你已经有了现存的可以发挥作用的能力，那么
    - It's easy to fall into the trap of changing A to A' or A+B, but this is a mistake
    你很容易掉进“将A变为A'或者A+B”的错误陷阱
    - Always give top priority to situational design
    正确的做法是永远将情景设计放在首位

## Replay Value

- What is replay value? 什么让玩家认为值得重玩
  - The point is not to force the player to keep playing
  - Replay value has to be linked to fun activities 重玩的价值必须和有趣的活动有关
  - It's essential that the player get to imrove their skills 重玩的本质是提高玩家的攻略技巧
    - This requires a structure that lets the player enjoy all of elements A,B,C,D,E, and F
    - Make the game feel like it was tailor-made for the player 让游戏感觉像是为玩家量身定做的

## Characters

- Action games let players enjoy a character's superpowers 动作游戏让玩家享受角色拥有的超能力
  - Fulfilling the desire to transform 喂饱玩家对变化的渴望
    - This requires main characters with rich personalities 这需要主角有丰富得到个性
  - Fight your way through any situation 让玩家可以用他们想要的任何方案进行战斗
- The order of designing unique characters with superpowers 设计独一无二的超能角色的顺序
  - Imagine the situation 想象情景
    - Create an image board
  - Design the game's selling points 设计游戏卖点
    - Functional design 函数化设计
  - Start designing the characters 开始设计角色
- Character art design directly and strongly affects the user experience 角色的艺术设计会直接地并强烈地影响用户体验

## Story

- What purpose does story have in an action game? 动作游戏中设计故事的目的何在
  - The most important purpose is "Motivation" 设计故事最终要的目的是给玩家动机。
  - Deep stories with lots of twists are not required 不需要有很多曲折的故事
  - The story should turn the designed situation into motivation in a natural way 故事应该以自然的方式将设计好的情境转化为动机

## High-level Design

- Not the same as level design 和关卡设计不一样

  - Considering the game flow in the largest possible unit 尽可能考虑这个游戏可能会进行到的结果

- Simply bombarding players with constant excitement become numbing after a while 仅仅通过固定数量的兴奋点大力刺激玩家，会让玩家过不了多久就麻木

- Create a tempo per stage 每个关卡制造一个节奏

  - Pacing is very important 节奏很重要

- Stage "Strength" 关卡强度

  关卡序号	设置强度（1-10）	玩家感受

  St. 1:					6							7

  St. 2:					4							4

  St. 3:					6							5

  St. 4:					7							8

  制作成本：6+4+6+7=23	制作效果：7+4+5+8=24

- Stage "Strength"(example of failed build-up)

  St. 1:	5	6	4

  St. 2:	6	5	5

  St. 3:	7	5	5

  St. 4:	8	6	4

  5+6+7+8=26	4+5+5+4=18

- With Transformers we focused on density 相比于控制变化，我们专注于控制密度

  - We didn't want players to put down the controller 我们不想让玩家放下手柄

## Summary