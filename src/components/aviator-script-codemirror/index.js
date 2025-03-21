export const funcList = [
    'sysdate()  ##返回当前日期对象 java.util.Date',
    'rand()  ##返回一个介于 [0, 1) 的随机数，结果为 double 类型',
    'rand(n)  ##返回一个介于 [0, n) 的随机数，结果为 long 类型',
    'cmp(x, y)  ##比较 x 和 y 大小，返回整数，0 表示相等， 1 表达式 x > y，负数则 x < y。',
    'print([out],obj)  ##打印对象,如果指定 out 输出流，向 out 打印， 默认输出到标准输出',
    'println([out],obj) 或者 p([out], obj)  ##与 print 类似,但是在输出后换行',
    'pst([out], e)  ##等价于 e.printStackTrace()，打印异常堆栈，out 是可选的输出流，默认是标准错误输出',
    'now()  ##返回 System.currentTimeMillis() 调用值',
    'long(v)  ##将值转为 long 类型',
    'double(v)  ##将值转为 double 类型',
    'str(v)  ##将值转为 string 类型，如果是 nil（或者 java null），会转成字符串 null',
    'bigint(x)  ##将值转为 bigint 类型',
    'decimal(x)  ##将值转为 decimal 类型',
    'identity(v)  ##返回参数 v 自身，用于跟 seq 库的高阶函数配合使用。',
    'type(x)  ##返回参数 x 的类型，结果为字符串，如 string, long, double, bigint, decimal, function 等。Java 类则返回完整类名。',
    'is_def(x)  ##返回变量 x 是否已定义（包括定义为 nil），结果为布尔值',
    'undef(x)  ##“遗忘”变量 x，如果变量 x 已经定义，将取消定义。',
    'range(start, end, [step])  ##创建一个范围，start 到 end 之间的整数范围，不包括 end， step 指定递增或者递减步幅。',
    'tuple(x1, x2, ...)  ##创建一个 Object 数组，元素即为传入的参数列表。',
    'eval(script, [bindings], [cached])  ##对一段脚本文本 script 进行求值，等价于 AviatorEvaluator.execute(script, env, cached)',
    'date_to_string(date,format)  ##将 Date 对象转化化特定格式的字符串,2.1.1 新增',
    'string_to_date(source,format)  ##将特定格式的字符串转化为 Date 对 象,2.1.1 新增',
    'string.contains(s1,s2)  ##判断 s1 是否包含 s2,返回 Boolean',
    'string.length(s)  ##求字符串长度,返回 Long',
    'string.startsWith(s1,s2)  ##s1 是否以 s2 开始,返回 Boolean',
    'string.endsWith(s1,s2)  ##s1 是否以 s2 结尾,返回 Boolean',
    'string.substring(s,begin[,end])  ##截取字符串 s,从 begin 到 end,如果忽略 end 的话,将从 begin 到结尾,与 java.util.String.substring 一样。',
    'string.indexOf(s1,s2)  ##java 中的 s1.indexOf(s2),求 s2 在 s1 中 的起始索引位置,如果不存在为-1',
    'string.split(target,regex,[limit])  ##Java 里的 String.split 方法一致,2.1.1 新增函数',
    'string.join(seq,seperator)  ##将集合 seq 里的元素以 seperator 为间隔 连接起来形成字符串,2.1.1 新增函数',
    'string.replace_first(s,regex,replacement)  ##Java 里的 String.replaceFirst 方法, 2.1.1 新增',
    'string.replace_all(s,regex,replacement)  ##Java 里的 String.replaceAll 方法 , 2.1.1 新增',
    'math.abs(d)  ##求 d 的绝对值',
    'math.sqrt(d)  ##求 d 的平方根',
    'math.pow(d1,d2)  ##求 d1 的 d2 次方',
    'math.log(d)  ##求 d 的自然对数',
    'math.log10(d)  ##求 d 以 10 为底的对数',
    'math.sin(d)  ##正弦函数',
    'math.cos(d)  ##余弦函数',
    'math.tan(d)  ##正切函数',
    'seq.array(clazz, e1, e2,e3, ...)  ##创建一个指定 clazz 类型的数组，并添加参数 e1,e2,e3 ...到这个数组并返回。 clazz 可以是类似 java.lang.String 的类型，也可以是原生类型，如 int/long/float 等',
    'seq.array_of(clazz, size)  ##创建 clazz 类型的数组，大小为 size 指定。clazz 同 seq.array 定义。',
    'seq.list(p1, p2, p3, ...)  ##创建一个 java.util.ArrayList 实例，添加参数到这个集合并返回。',
    'seq.set(p1, p2, p3, ...)  ##创建一个 java.util.HashSet 实例，添加参数到这个集合并返回。',
    'seq.map(k1, v1, k2, v2, ...)  ##创建一个 java.util.HashMap 实例，参数要求偶数个，类似 k1,v1 这样成对作为 key-value 存入 map，返回集合。',
    'seq.entry(key, value)  ##创建 Map.Entry 对象，用于 map, filter 等函数',
    'into(to_seq, from_seq)  ##用于 sequence 转换，将 from sequence 的元素使用 seq.add 函数逐一添加到了 to sequence 并返回最终的 to_seq',
    'seq.contains_key(map, key)  ##当 map 中存在 key 的时候（可能为 null），返回 true。对于数组和链表，key 可以是 index，当 index 在有效范围[0..len-1]，返回 true，否则返回 false',
    'seq.add(coll, element)seq.add(m, key, value)  ##往集合 coll 添加元素，集合可以是 java.util.Collection，也可以是 java.util.Map（三参数版本）',
    'seq.put(coll, key, value)  ##类似 List.set(i, v)。用于设置 seq 在 key 位置的值为 value，seq 可以是 map ，数组或者 List。 map 就是键值对， 数组或者 List 的时候， key 为索引位置整数，value 即为想要放入该索引位置的值。',
    'seq.remove(coll, element)  ##从集合或者 hash map 中删除元素或者 key',
    'seq.get(coll, element)  ##从 list、数组或者 hash-map 获取对应的元素值，对于 list 和数组， element 为元素的索引位置（从 0 开始），对于 hash map 来说， element 为 key。',
    'map(seq,fun)  ##将函数 fun 作用到集合 seq 每个元素上, 返回新元素组成的集合',
    'filter(seq,predicate)  ##将谓词 predicate 作用在集合的每个元素 上,返回谓词为 true 的元素组成的集合',
    'count(seq)  ##返回集合大小，seq 可以是数组，字符串，range ，List 等等',
    'include(seq,element)  ##判断 element 是否在集合 seq 中,返回 boolean 值，对于 java.uitl.Set 是 O(1) 时间复杂度，其他为 O(n)',
    'sort(seq)  ##排序集合,仅对数组和 List 有效,返回排 序后的新集合',
    'reduce(seq,fun,init)  ##fun 接收两个参数,第一个是集合元素, 第二个是累积的函数,本函数用于将 fun 作用在结果值（初始值为 init 指定)和集合的每个元素上面，返回新的结果值；函数返回最终的结果值',
    'seq.every(seq, fun)  ##fun 接收集合的每个元素作为唯一参数，返回 true 或 false。当集合里的每个元素调用 fun 后都返回 true 的时候，整个调用结果为 true，否则为 false。',
    'seq.not_any(seq, fun)  ##fun 接收集合的每个元素作为唯一参数，返回 true 或 false。当集合里的每个元素调用 fun 后都返回 false 的时候，整个调用结果为 true，否则为 false。',
    'seq.some(seq, fun)  ##fun 接收集合的每个元素作为唯一参数，返回 true 或 false。当集合里的只要有一个元素调用 fun 后返回 true 的时候，整个调用结果立即为该元素，否则为 nil。',
    'seq.eq(value)  ##返回一个谓词,用来判断传入的参数是否跟 value 相等,用于 filter 函数,如filter(seq,seq.eq(3)) 过滤返回等于3 的元素组成的集合',
    'seq.neq(value)  ##与 seq.eq 类似,返回判断不等于的谓词',
    'seq.gt(value)  ##返回判断大于 value 的谓词',
    'seq.ge(value)  ##返回判断大于等于 value 的谓词',
    'seq.lt(value)  ##返回判断小于 value 的谓词',
    'seq.le(value)  ##返回判断小于等于 value 的谓词',
    'seq.nil()  ##返回判断是否为 nil 的谓词',
    'seq.exists()  ##返回判断不为 nil 的谓词',
    'seq.and(p1, p2, p3, ...)  ##组合多个谓词函数，返回一个新的谓词函数，当今仅当 p1、p2、p3 ...等所有函数都返回 true 的时候，新函数返回 true',
    'seq.or(p1, p2, p3, ...)  ##组合多个谓词函数，返回一个新的谓词函数，当 p1, p2, p3... 其中一个返回 true 的时候，新函数立即返回 true，否则返回 false。',
    'seq.min(coll)  ##返回集合中的最小元素，要求集合元素可比较（实现 Comprable 接口），比较规则遵循 aviator 规则。',
    'seq.max(coll)  ##返回集合中的最大元素，要求集合元素可比较（实现 Comprable 接口），比较规则遵循 aviator 规则。',
];
