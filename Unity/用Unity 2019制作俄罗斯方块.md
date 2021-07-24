# 用Unity 2019制作俄罗斯方块
date: 2020-04-09 21:26:00

版本：Unity 2019.3.4f1 Personal

# 脚本

```c# GameManager.cs
using DG.Tweening;
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class GameManager : MonoBehaviour
{
    enum GameState
    {
        Start,
        Stop
    }
    GameState gameState = GameState.Stop;
    public Button startGame;//开始游戏按钮
    public Button stopGame;//停止游戏按钮
    public Transform MaxPosx;//方块X轴可移动的最小位置，相当于地图边界
    public Transform MinPosx;//X轴最小
    public Transform MaxPosy;//Y轴最大
    public Transform MinPosy;//Y轴最小
    public Transform[,] map = new Transform[11, 15];//二维数组，方块信息存储起来
    public GameObject[] shapes = new GameObject[7];//7种不同的形状
    public Sprite[] sprites = new Sprite[7];//七种颜色的方块
    public Sprite[] levelSprite = new Sprite[5];
    Transform currentShape;//当前形状
    Transform nextShape;//下一个形状
    private Transform preview;//预览形状的父物体
    private int level = 1;//等级
    private int score = 0;//分数
    private float initSpeed = 0.8f;//初始每次下降的时间
    private Transform shapePool;//方块的父物体
    public float spacing;//两个方块的间距
    private Transform gameOver;//游戏结束图片
    private Image levelImage;
    private Text scoreText;//分数文本
    private Text upgradeScoreText;//升级分数文本
    private AudioSource audioSource;//音频源组件
    public AudioClip[] audioClips;//音频剪辑的数组

    // Start is called before the first frame update
    void Start()
    {
        preview = GameObject.Find("Preview").transform;
        spacing = Mathf.Abs(GameObject.Find("Row/Block (1)").transform.position.x
            - GameObject.Find("Row/Block (2)").transform.position.x);
        shapePool = GameObject.Find("ShapePool").transform;
        levelImage = GameObject.Find("Level").GetComponent<Image>();
        gameOver = transform.Find("GameOver");
        scoreText = GameObject.Find("ScoreText").GetComponent<Text>();
        upgradeScoreText = GameObject.Find("UpgradeScoreText").GetComponent<Text>();
        audioSource = transform.GetComponent<AudioSource>();
        startGame.onClick.AddListener(StartGame);
        stopGame.onClick.AddListener(StopGame);
    }
    /// <summary>
    /// 停止游戏
    /// </summary>
    private void StopGame()
    {
        if(gameState == GameState.Start)
        {
            gameState = GameState.Stop;
            if(currentShape != null)
            {//当前形状和下一块的形状不为空就销毁，等待下一局开始重新分配
                Destroy(currentShape.gameObject);
            }
            if(nextShape != null)
            {
                Destroy(nextShape.gameObject);
            }
            for(int i = 0; i < shapePool.childCount; i++)
            {
                Destroy(shapePool.GetChild(i).gameObject);
            }
            for(int i = 0; i < map.GetLength(0); i++)
            {
                for(int j = 0; j < map.GetLength(1); j++)
                {
                    map[i, j] = null;
                }
            }
        }
        //重置等级和积分
        level = 1;
        score = 0;
        scoreText.text = "当前积分：0";
        upgradeScoreText.text = "升级积分：100";
        levelImage.sprite = levelSprite[0];
        //显示游戏结束的画面
        StartCoroutine(OpenGameOver());
        
    }
    /// <summary>
    /// 开始游戏
    /// </summary>
    private void StartGame()
    {
        if(gameState == GameState.Stop)
        {
            level = 1;
            score = 0;
            scoreText.text = "当前积分：0";
            upgradeScoreText.text = "升级积分：100";
            gameState = GameState.Start;
            gameOver.gameObject.SetActive(false);
            //游戏开始时候的初始化工作

            //生成不同形状的方块，开始游戏需要播放音频
            SpawnShape();//生成形状
            PlayAudio(3);//播放声音
        }
    }
    /// <summary>
    /// 消除方块
    /// </summary>
    /// <param name="rowIndex"></param>
    private void ClearShape(List<int> rowIndex)
    {
        bool isMove = true;
        for(int i = 0; i < rowIndex.Count; i++)
        {
            for(int j = 0; j < map.GetLength(0); j++)
            {
                if(map[j, rowIndex[i]] != null)
                {
                    //对每个需要消除的格子进行消除
                    Transform block = map[j, rowIndex[i]];
                    map[j, rowIndex[i]] = null;
                    block.GetComponent<Image>().DOFade(0, 0.2f)
                        .SetLoops(4)
                        .SetEase(Ease.Linear)
                        .OnComplete(() => 
                        {
                            Destroy(block.gameObject);
                            if (isMove)
                            {
                                isMove = false;
                                MoveLines(rowIndex);
                            }
                        });
                }
            }
        }
    }
    /// <summary>
    /// 消除后移动剩余方块的方法，让他们到达应该在的位置
    /// </summary>
    /// <param name="rowIndex"></param>
    private void MoveLines(List<int> rowIndex)
    {
        for(int i = rowIndex[0];i < map.GetLength(1) ; i++)
        {
            for(int j= 0;j < map.GetLength(0); j++)
            {
                if(map[j,i] != null)
                {
                    int dropRow = GetDropRow(rowIndex,i);
                    map[j, i - dropRow] = map[j, i];//将当前这个格子的数据存到要下降的那个格子去
                    map[j, i] = null;
                    map[j, i - dropRow].position -= new Vector3(0, dropRow * spacing, 0);
                }
            }
        }
        CheckGameState();
    }
    /// <summary>
    /// 获取要消除多少行
    /// </summary>
    /// <param name="rowIndex"></param>
    /// <param name="currentRow"></param>
    /// <returns></returns>
    private int GetDropRow(List<int> rowIndex,int currentRow)
    {
        int dropRow = 0;
        for(int i = 0; i < rowIndex.Count; i++)
        {
            if(currentRow > rowIndex[i])
            {
                dropRow++;
            }
        }
        return dropRow;
    }
    /// <summary>
    /// 检测游戏是否结束
    /// </summary>
    private void CheckGameState()
    {
        for(int i = 0; i < map.GetLength(0); i++)
        {
            if(map[i, map.GetLength(1)-1]!= null)
            {
                StopGame();
                break;
            }
        }
        if(gameState == GameState.Start)
        {
            SpawnShape();
        }
    }
    /// <summary>
    /// 保存地图数据，方块不能掉落后就保存进来
    /// </summary>
    /// <param name="shape"></param>
    public void SaveShape(Transform shape)
    {
        //保存地图数据
        for(int i = 0; i < shape.childCount; i++)
        {
            if (!shape.GetChild(i).CompareTag("ShapePivot"))
            {
                Vector3 childPos = shape.GetChild(i).position;
                int xIndex = (int)((childPos.x - MinPosx.position.x) / spacing);
                int yIndex = (int)((childPos.y - MinPosy.position.y) / spacing);
                //求出再地图内对应的格子
                if(yIndex < map.GetLength(1))
                {
                    map[xIndex, yIndex] = shape.GetChild(i);
                }
                else
                {
                    StopGame();
                    return;
                    //游戏结束
                }
            }
        }
        //检查是否需要消除
        CheckClear();
    }
    /// <summary>
    /// 方块消除检测
    /// </summary>
    public void CheckClear()
    {
        //检查是否有需要消除的方块
        List<int> rowIndex = new List<int>();
        for (int i = 0; i < map.GetLength(1); i++)
        {
            bool isClear = true;
            for(int j = 0; j < map.GetLength(0); j++)
            {
                if(map[j, i] == null)
                {
                    isClear = false;
                    break;
                }
            }
            if (isClear)
            {
                rowIndex.Add(i);
            }
        }
        if (rowIndex.Count >= 1)
        {
            ClearShape(rowIndex);//调用消除的方法
            //积分增长与升级
            score += rowIndex.Count * 10;//每消除一行加10分
            if(score > level * 100 && level < 5)
            {
                level += 1;
                levelImage.sprite = levelSprite[level - 1];
                if(level < 5)
                {
                    upgradeScoreText.text = "升级积分：" + level * 100;
                }
                else
                {
                    upgradeScoreText.text = "已经满级";
                }
            }
            scoreText.text = "当前积分：" + score;
            //播放消除的音效
            PlayAudio(1);//播放声音
        }
        else
        {//如果不需要消除，那么需要判断游戏是否结束，如果没有结束就要生成新的可控制方块
            CheckGameState();
        }
    }
    /// <summary>
    /// 判断方块的位置是否合法，首先是否超出地图边界，然后判断是否有和其他方块重叠
    /// </summary>
    /// <param name="shape"></param>
    /// <returns></returns>
    public bool CheckPos(Transform shape)
    {
        for(int i = 0; i < shape.childCount; i++)
        {
            if (shape.GetChild(i).CompareTag("ShapePivot") == false)
            {
                Vector3 childPos = shape.GetChild(i).position;
                if(childPos.x < MinPosx.position.x 
                    || childPos.x > MaxPosx.position.x
                    || childPos.y < MinPosy.position.y)
                 //   || childPos.y > MaxPosy.position.y)
                {
                    return false;
                }
                int xIndex = (int)((childPos.x - MinPosx.position.x) / spacing);
                int yIndex = (int)((childPos.y - MinPosy.position.y) / spacing);
                Debug.Log("对应的索引是：" + xIndex + "Y的索引" + yIndex);
                if(yIndex < map.GetLength(1))
                {//Y轴小于地图边界的时候再来计算它是否有重叠
                    if(map[xIndex, yIndex] != null)
                    {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    /// <summary>
    /// 生成方块的方法
    /// </summary>
    public void SpawnShape()
    {
        if(gameState == GameState.Stop)
        {
            return;
        }
        int shapeIndex;//形状的索引
        int colorIndex;//颜色的索引
        if(nextShape == null)
        {//游戏刚开始的时候，下一个形状会为空
            //先随机生成颜色和形状的索引
            shapeIndex = UnityEngine.Random.Range(0, shapes.Length);
            colorIndex = UnityEngine.Random.Range(0, sprites.Length);
            //克隆出随机到的形状和赋予对应的颜色
            currentShape = GameObject.Instantiate(shapes[shapeIndex]).transform;
            for(int i = 0; i < currentShape.childCount; i++)
            {
                if (!currentShape.GetChild(i).CompareTag("ShapePivot"))
                {
                    currentShape.GetChild(i).GetComponent<Image>().sprite = sprites[colorIndex];
                }
            }
        }
        else
        {
            currentShape = nextShape;
        }
        currentShape.gameObject.AddComponent<ShapeControl>().Init(initSpeed - level/10f, spacing);
        shapeIndex = UnityEngine.Random.Range(0, shapes.Length);
        colorIndex = UnityEngine.Random.Range(0, sprites.Length);
        nextShape = GameObject.Instantiate(shapes[shapeIndex]).transform;
        for (int i = 0; i < currentShape.childCount; i++)
        {
            if (!currentShape.GetChild(i).CompareTag("ShapePivot"))
            {
                currentShape.GetChild(i).GetComponent<Image>().sprite = sprites[colorIndex];
            }
        }
        nextShape.SetParent(preview);
        nextShape.localPosition = Vector3.zero;
    }
    /// <summary>
    /// 开启游戏结束的图片，1秒后自动关闭
    /// </summary>
    /// <returns></returns>
    private IEnumerator OpenGameOver()
    {
        gameOver.gameObject.SetActive(true);
        yield return new WaitForSeconds(1);
        gameOver.gameObject.SetActive(false);
    }
    /// <summary>
    /// 播放音效
    /// </summary>
    /// <param name="index"></param>
    public void PlayAudio(int index)
    {
        audioSource.clip = audioClips[index];
        audioSource.Play();
    }
}
```

```c# ShapeControl.cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ShapeControl : MonoBehaviour
{
    float speed; //下降速度，值越低下降越快
    float spacing;//间距，每次下降移动的值
    float mTimer;//计时
    GameManager gameManager;
    Transform mPivot;//方块旋转的中心
    bool isStopDown = false;

    public void Init(float speed,float spacing)
    {
        //初始化设置物体生成的位置和给一些变量赋值
        gameManager = GameObject.Find("BG").GetComponent<GameManager>();
        transform.SetParent(GameObject.Find("ShapePool").transform);
        if(gameObject.name.Contains("Shape (3)"))
        {
            transform.localPosition = new Vector2(-spacing / 2, 0);
        }
        else
        {
            transform.localPosition = Vector3.zero;
        }
        this.speed = speed;
        this.spacing = spacing;
        mPivot = transform.Find("Pivot");
    }
    // Update is called once per frame
    void Update()
    {
        if (isStopDown)
        {
            return;
        }
        mTimer += Time.deltaTime;
        if(mTimer >= speed)
        {
            mTimer = 0;
            //时间到了，方块向下移动一格
            SetPositionOrRotate(new Vector3(0, -spacing, 0), 0);
        }
        if (Input.GetKeyDown(KeyCode.LeftArrow))
        {
            //按下左方向键，控制方块向左移动一格
            SetPositionOrRotate(new Vector3(-spacing, 0, 0), 0);
        }
        if (Input.GetKeyDown(KeyCode.RightArrow))
        {
            //按下右方向键，控制方块向右移动一格
            SetPositionOrRotate(new Vector3(spacing, 0, 0), 0);
        }
        if (Input.GetKeyDown(KeyCode.UpArrow))
        {
            //按上方向键，旋转方块
            SetPositionOrRotate(new Vector3(0, 0, 0), 90);
        }
        if (Input.GetKeyDown(KeyCode.DownArrow))
        {
            //按下向下方向键，加快移动速度
            speed = speed / 2;
        }     
    }
    /// <summary>
    /// 设置这个形状的位置或者形状
    /// </summary>
    /// <param name="pos">移动位置</param>
    /// <param name="rotate">旋转角度</param>
    private void SetPositionOrRotate(Vector3 pos,float rotate)
    {
        if(isStopDown)
        {
            return;
        }
        if(pos != Vector3.zero)
        {
            transform.position += pos;
            Debug.Log(transform.position);
            if (gameManager.CheckPos(transform) == false)
            {
                transform.position -= pos;
                if(pos.y != 0)
                {
                    isStopDown = true;
                    gameManager.SaveShape(transform);
                    Debug.Log("删除了脚本");
                    Destroy(this);//删除自身这个脚本组件，不再接受控制了
                }
            }
            else
            {
                //如果移动合法，根据左右移动或者向下移动播放不同的音效
                if(pos.y != 0)
                {
                    gameManager.PlayAudio(0);//播放下落的音效
                }
                else
                {
                    gameManager.PlayAudio(2);//播放移动和旋转的音效
                }
            }          
        }
        if(rotate != 0)
        {
            transform.RotateAround(mPivot.position,Vector3.forward, rotate);
            if(gameManager.CheckPos(transform) == false)
            {
                transform.RotateAround(mPivot.position, Vector3.forward, -rotate);
            }
            else
            {
                gameManager.PlayAudio(2);//播放移动和旋转的音效
                //播放声音
            }
        }
    }
}
```