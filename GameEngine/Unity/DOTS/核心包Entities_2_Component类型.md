# Component类型

按内存类型划分：
1. 非托管Component
2. 托管Component

非托管component存储最常见的数据类型，适用绝大多数情况。
非托管component可以存储以下类型的属性：
1. Blittable类型
2. bool
3. char
4. BlobAssetReference<T>
5. Collections.FixedString
6. Collections.FixedList
7. Fixed array（只允许用于不安全的环境）
8. 其他同样符合这些约束的结构体

托管Component

//todo

按功能类型划分：
1. 一半Component
2. Shared Component
3. Tag Component
4. Enableable Component
5. Cleanup Component
6. Singleton Component

按数据访问类型划分
1. 按Entity访问
2. 按Chunk访问
3. 按Element访问

按接口类型划分
1. IEnableableComponent
2. ISystemStateComponentData
3. ISystemStateSharedComponentData
4. IComponentData
5. ISharedComponentData
6. IBufferElementData