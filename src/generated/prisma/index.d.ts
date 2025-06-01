
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Student
 * 
 */
export type Student = $Result.DefaultSelection<Prisma.$StudentPayload>
/**
 * Model Teacher
 * 
 */
export type Teacher = $Result.DefaultSelection<Prisma.$TeacherPayload>
/**
 * Model TempatPkl
 * 
 */
export type TempatPkl = $Result.DefaultSelection<Prisma.$TempatPklPayload>
/**
 * Model Jurnal
 * 
 */
export type Jurnal = $Result.DefaultSelection<Prisma.$JurnalPayload>
/**
 * Model JurnalComment
 * 
 */
export type JurnalComment = $Result.DefaultSelection<Prisma.$JurnalCommentPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER',
  ADMIN: 'ADMIN'
};

export type Role = (typeof Role)[keyof typeof Role]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.student`: Exposes CRUD operations for the **Student** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Students
    * const students = await prisma.student.findMany()
    * ```
    */
  get student(): Prisma.StudentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.teacher`: Exposes CRUD operations for the **Teacher** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Teachers
    * const teachers = await prisma.teacher.findMany()
    * ```
    */
  get teacher(): Prisma.TeacherDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tempatPkl`: Exposes CRUD operations for the **TempatPkl** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TempatPkls
    * const tempatPkls = await prisma.tempatPkl.findMany()
    * ```
    */
  get tempatPkl(): Prisma.TempatPklDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.jurnal`: Exposes CRUD operations for the **Jurnal** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Jurnals
    * const jurnals = await prisma.jurnal.findMany()
    * ```
    */
  get jurnal(): Prisma.JurnalDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.jurnalComment`: Exposes CRUD operations for the **JurnalComment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more JurnalComments
    * const jurnalComments = await prisma.jurnalComment.findMany()
    * ```
    */
  get jurnalComment(): Prisma.JurnalCommentDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.8.2
   * Query Engine version: 2060c79ba17c6bb9f5823312b6f6b7f4a845738e
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Student: 'Student',
    Teacher: 'Teacher',
    TempatPkl: 'TempatPkl',
    Jurnal: 'Jurnal',
    JurnalComment: 'JurnalComment'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "student" | "teacher" | "tempatPkl" | "jurnal" | "jurnalComment"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Student: {
        payload: Prisma.$StudentPayload<ExtArgs>
        fields: Prisma.StudentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StudentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StudentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>
          }
          findFirst: {
            args: Prisma.StudentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StudentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>
          }
          findMany: {
            args: Prisma.StudentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>[]
          }
          create: {
            args: Prisma.StudentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>
          }
          createMany: {
            args: Prisma.StudentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StudentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>[]
          }
          delete: {
            args: Prisma.StudentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>
          }
          update: {
            args: Prisma.StudentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>
          }
          deleteMany: {
            args: Prisma.StudentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StudentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StudentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>[]
          }
          upsert: {
            args: Prisma.StudentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>
          }
          aggregate: {
            args: Prisma.StudentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStudent>
          }
          groupBy: {
            args: Prisma.StudentGroupByArgs<ExtArgs>
            result: $Utils.Optional<StudentGroupByOutputType>[]
          }
          count: {
            args: Prisma.StudentCountArgs<ExtArgs>
            result: $Utils.Optional<StudentCountAggregateOutputType> | number
          }
        }
      }
      Teacher: {
        payload: Prisma.$TeacherPayload<ExtArgs>
        fields: Prisma.TeacherFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TeacherFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeacherPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TeacherFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeacherPayload>
          }
          findFirst: {
            args: Prisma.TeacherFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeacherPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TeacherFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeacherPayload>
          }
          findMany: {
            args: Prisma.TeacherFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeacherPayload>[]
          }
          create: {
            args: Prisma.TeacherCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeacherPayload>
          }
          createMany: {
            args: Prisma.TeacherCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TeacherCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeacherPayload>[]
          }
          delete: {
            args: Prisma.TeacherDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeacherPayload>
          }
          update: {
            args: Prisma.TeacherUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeacherPayload>
          }
          deleteMany: {
            args: Prisma.TeacherDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TeacherUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TeacherUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeacherPayload>[]
          }
          upsert: {
            args: Prisma.TeacherUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeacherPayload>
          }
          aggregate: {
            args: Prisma.TeacherAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTeacher>
          }
          groupBy: {
            args: Prisma.TeacherGroupByArgs<ExtArgs>
            result: $Utils.Optional<TeacherGroupByOutputType>[]
          }
          count: {
            args: Prisma.TeacherCountArgs<ExtArgs>
            result: $Utils.Optional<TeacherCountAggregateOutputType> | number
          }
        }
      }
      TempatPkl: {
        payload: Prisma.$TempatPklPayload<ExtArgs>
        fields: Prisma.TempatPklFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TempatPklFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TempatPklPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TempatPklFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TempatPklPayload>
          }
          findFirst: {
            args: Prisma.TempatPklFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TempatPklPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TempatPklFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TempatPklPayload>
          }
          findMany: {
            args: Prisma.TempatPklFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TempatPklPayload>[]
          }
          create: {
            args: Prisma.TempatPklCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TempatPklPayload>
          }
          createMany: {
            args: Prisma.TempatPklCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TempatPklCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TempatPklPayload>[]
          }
          delete: {
            args: Prisma.TempatPklDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TempatPklPayload>
          }
          update: {
            args: Prisma.TempatPklUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TempatPklPayload>
          }
          deleteMany: {
            args: Prisma.TempatPklDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TempatPklUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TempatPklUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TempatPklPayload>[]
          }
          upsert: {
            args: Prisma.TempatPklUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TempatPklPayload>
          }
          aggregate: {
            args: Prisma.TempatPklAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTempatPkl>
          }
          groupBy: {
            args: Prisma.TempatPklGroupByArgs<ExtArgs>
            result: $Utils.Optional<TempatPklGroupByOutputType>[]
          }
          count: {
            args: Prisma.TempatPklCountArgs<ExtArgs>
            result: $Utils.Optional<TempatPklCountAggregateOutputType> | number
          }
        }
      }
      Jurnal: {
        payload: Prisma.$JurnalPayload<ExtArgs>
        fields: Prisma.JurnalFieldRefs
        operations: {
          findUnique: {
            args: Prisma.JurnalFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JurnalPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.JurnalFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JurnalPayload>
          }
          findFirst: {
            args: Prisma.JurnalFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JurnalPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.JurnalFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JurnalPayload>
          }
          findMany: {
            args: Prisma.JurnalFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JurnalPayload>[]
          }
          create: {
            args: Prisma.JurnalCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JurnalPayload>
          }
          createMany: {
            args: Prisma.JurnalCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.JurnalCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JurnalPayload>[]
          }
          delete: {
            args: Prisma.JurnalDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JurnalPayload>
          }
          update: {
            args: Prisma.JurnalUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JurnalPayload>
          }
          deleteMany: {
            args: Prisma.JurnalDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.JurnalUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.JurnalUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JurnalPayload>[]
          }
          upsert: {
            args: Prisma.JurnalUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JurnalPayload>
          }
          aggregate: {
            args: Prisma.JurnalAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateJurnal>
          }
          groupBy: {
            args: Prisma.JurnalGroupByArgs<ExtArgs>
            result: $Utils.Optional<JurnalGroupByOutputType>[]
          }
          count: {
            args: Prisma.JurnalCountArgs<ExtArgs>
            result: $Utils.Optional<JurnalCountAggregateOutputType> | number
          }
        }
      }
      JurnalComment: {
        payload: Prisma.$JurnalCommentPayload<ExtArgs>
        fields: Prisma.JurnalCommentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.JurnalCommentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JurnalCommentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.JurnalCommentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JurnalCommentPayload>
          }
          findFirst: {
            args: Prisma.JurnalCommentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JurnalCommentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.JurnalCommentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JurnalCommentPayload>
          }
          findMany: {
            args: Prisma.JurnalCommentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JurnalCommentPayload>[]
          }
          create: {
            args: Prisma.JurnalCommentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JurnalCommentPayload>
          }
          createMany: {
            args: Prisma.JurnalCommentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.JurnalCommentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JurnalCommentPayload>[]
          }
          delete: {
            args: Prisma.JurnalCommentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JurnalCommentPayload>
          }
          update: {
            args: Prisma.JurnalCommentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JurnalCommentPayload>
          }
          deleteMany: {
            args: Prisma.JurnalCommentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.JurnalCommentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.JurnalCommentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JurnalCommentPayload>[]
          }
          upsert: {
            args: Prisma.JurnalCommentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JurnalCommentPayload>
          }
          aggregate: {
            args: Prisma.JurnalCommentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateJurnalComment>
          }
          groupBy: {
            args: Prisma.JurnalCommentGroupByArgs<ExtArgs>
            result: $Utils.Optional<JurnalCommentGroupByOutputType>[]
          }
          count: {
            args: Prisma.JurnalCommentCountArgs<ExtArgs>
            result: $Utils.Optional<JurnalCommentCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    student?: StudentOmit
    teacher?: TeacherOmit
    tempatPkl?: TempatPklOmit
    jurnal?: JurnalOmit
    jurnalComment?: JurnalCommentOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type StudentCountOutputType
   */

  export type StudentCountOutputType = {
    jurnals: number
  }

  export type StudentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    jurnals?: boolean | StudentCountOutputTypeCountJurnalsArgs
  }

  // Custom InputTypes
  /**
   * StudentCountOutputType without action
   */
  export type StudentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentCountOutputType
     */
    select?: StudentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * StudentCountOutputType without action
   */
  export type StudentCountOutputTypeCountJurnalsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JurnalWhereInput
  }


  /**
   * Count Type TeacherCountOutputType
   */

  export type TeacherCountOutputType = {
    comments: number
  }

  export type TeacherCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    comments?: boolean | TeacherCountOutputTypeCountCommentsArgs
  }

  // Custom InputTypes
  /**
   * TeacherCountOutputType without action
   */
  export type TeacherCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeacherCountOutputType
     */
    select?: TeacherCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TeacherCountOutputType without action
   */
  export type TeacherCountOutputTypeCountCommentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JurnalCommentWhereInput
  }


  /**
   * Count Type TempatPklCountOutputType
   */

  export type TempatPklCountOutputType = {
    students: number
  }

  export type TempatPklCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    students?: boolean | TempatPklCountOutputTypeCountStudentsArgs
  }

  // Custom InputTypes
  /**
   * TempatPklCountOutputType without action
   */
  export type TempatPklCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TempatPklCountOutputType
     */
    select?: TempatPklCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TempatPklCountOutputType without action
   */
  export type TempatPklCountOutputTypeCountStudentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudentWhereInput
  }


  /**
   * Count Type JurnalCountOutputType
   */

  export type JurnalCountOutputType = {
    comments: number
  }

  export type JurnalCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    comments?: boolean | JurnalCountOutputTypeCountCommentsArgs
  }

  // Custom InputTypes
  /**
   * JurnalCountOutputType without action
   */
  export type JurnalCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JurnalCountOutputType
     */
    select?: JurnalCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * JurnalCountOutputType without action
   */
  export type JurnalCountOutputTypeCountCommentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JurnalCommentWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    username: string | null
    name: string | null
    passwordHash: string | null
    role: $Enums.Role | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    username: string | null
    name: string | null
    passwordHash: string | null
    role: $Enums.Role | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    username: number
    name: number
    passwordHash: number
    role: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    username?: true
    name?: true
    passwordHash?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    username?: true
    name?: true
    passwordHash?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    username?: true
    name?: true
    passwordHash?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    username: string
    name: string
    passwordHash: string
    role: $Enums.Role
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    username?: boolean
    name?: boolean
    passwordHash?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    student?: boolean | User$studentArgs<ExtArgs>
    teacher?: boolean | User$teacherArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    username?: boolean
    name?: boolean
    passwordHash?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    username?: boolean
    name?: boolean
    passwordHash?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    username?: boolean
    name?: boolean
    passwordHash?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "username" | "name" | "passwordHash" | "role" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | User$studentArgs<ExtArgs>
    teacher?: boolean | User$teacherArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      student: Prisma.$StudentPayload<ExtArgs> | null
      teacher: Prisma.$TeacherPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      username: string
      name: string
      passwordHash: string
      role: $Enums.Role
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    student<T extends User$studentArgs<ExtArgs> = {}>(args?: Subset<T, User$studentArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    teacher<T extends User$teacherArgs<ExtArgs> = {}>(args?: Subset<T, User$teacherArgs<ExtArgs>>): Prisma__TeacherClient<$Result.GetResult<Prisma.$TeacherPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.student
   */
  export type User$studentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    where?: StudentWhereInput
  }

  /**
   * User.teacher
   */
  export type User$teacherArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Teacher
     */
    select?: TeacherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Teacher
     */
    omit?: TeacherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeacherInclude<ExtArgs> | null
    where?: TeacherWhereInput
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Student
   */

  export type AggregateStudent = {
    _count: StudentCountAggregateOutputType | null
    _min: StudentMinAggregateOutputType | null
    _max: StudentMaxAggregateOutputType | null
  }

  export type StudentMinAggregateOutputType = {
    id: string | null
    userId: string | null
    nisn: string | null
    kelas: string | null
    jurusan: string | null
    tempatPklId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StudentMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    nisn: string | null
    kelas: string | null
    jurusan: string | null
    tempatPklId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StudentCountAggregateOutputType = {
    id: number
    userId: number
    nisn: number
    kelas: number
    jurusan: number
    tempatPklId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type StudentMinAggregateInputType = {
    id?: true
    userId?: true
    nisn?: true
    kelas?: true
    jurusan?: true
    tempatPklId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StudentMaxAggregateInputType = {
    id?: true
    userId?: true
    nisn?: true
    kelas?: true
    jurusan?: true
    tempatPklId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StudentCountAggregateInputType = {
    id?: true
    userId?: true
    nisn?: true
    kelas?: true
    jurusan?: true
    tempatPklId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type StudentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Student to aggregate.
     */
    where?: StudentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Students to fetch.
     */
    orderBy?: StudentOrderByWithRelationInput | StudentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StudentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Students from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Students.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Students
    **/
    _count?: true | StudentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StudentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StudentMaxAggregateInputType
  }

  export type GetStudentAggregateType<T extends StudentAggregateArgs> = {
        [P in keyof T & keyof AggregateStudent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStudent[P]>
      : GetScalarType<T[P], AggregateStudent[P]>
  }




  export type StudentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudentWhereInput
    orderBy?: StudentOrderByWithAggregationInput | StudentOrderByWithAggregationInput[]
    by: StudentScalarFieldEnum[] | StudentScalarFieldEnum
    having?: StudentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StudentCountAggregateInputType | true
    _min?: StudentMinAggregateInputType
    _max?: StudentMaxAggregateInputType
  }

  export type StudentGroupByOutputType = {
    id: string
    userId: string
    nisn: string
    kelas: string
    jurusan: string
    tempatPklId: string | null
    createdAt: Date
    updatedAt: Date
    _count: StudentCountAggregateOutputType | null
    _min: StudentMinAggregateOutputType | null
    _max: StudentMaxAggregateOutputType | null
  }

  type GetStudentGroupByPayload<T extends StudentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StudentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StudentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StudentGroupByOutputType[P]>
            : GetScalarType<T[P], StudentGroupByOutputType[P]>
        }
      >
    >


  export type StudentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    nisn?: boolean
    kelas?: boolean
    jurusan?: boolean
    tempatPklId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    tempatPkl?: boolean | Student$tempatPklArgs<ExtArgs>
    jurnals?: boolean | Student$jurnalsArgs<ExtArgs>
    _count?: boolean | StudentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["student"]>

  export type StudentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    nisn?: boolean
    kelas?: boolean
    jurusan?: boolean
    tempatPklId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    tempatPkl?: boolean | Student$tempatPklArgs<ExtArgs>
  }, ExtArgs["result"]["student"]>

  export type StudentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    nisn?: boolean
    kelas?: boolean
    jurusan?: boolean
    tempatPklId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    tempatPkl?: boolean | Student$tempatPklArgs<ExtArgs>
  }, ExtArgs["result"]["student"]>

  export type StudentSelectScalar = {
    id?: boolean
    userId?: boolean
    nisn?: boolean
    kelas?: boolean
    jurusan?: boolean
    tempatPklId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type StudentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "nisn" | "kelas" | "jurusan" | "tempatPklId" | "createdAt" | "updatedAt", ExtArgs["result"]["student"]>
  export type StudentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    tempatPkl?: boolean | Student$tempatPklArgs<ExtArgs>
    jurnals?: boolean | Student$jurnalsArgs<ExtArgs>
    _count?: boolean | StudentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type StudentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    tempatPkl?: boolean | Student$tempatPklArgs<ExtArgs>
  }
  export type StudentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    tempatPkl?: boolean | Student$tempatPklArgs<ExtArgs>
  }

  export type $StudentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Student"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      tempatPkl: Prisma.$TempatPklPayload<ExtArgs> | null
      jurnals: Prisma.$JurnalPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      nisn: string
      kelas: string
      jurusan: string
      tempatPklId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["student"]>
    composites: {}
  }

  type StudentGetPayload<S extends boolean | null | undefined | StudentDefaultArgs> = $Result.GetResult<Prisma.$StudentPayload, S>

  type StudentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StudentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StudentCountAggregateInputType | true
    }

  export interface StudentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Student'], meta: { name: 'Student' } }
    /**
     * Find zero or one Student that matches the filter.
     * @param {StudentFindUniqueArgs} args - Arguments to find a Student
     * @example
     * // Get one Student
     * const student = await prisma.student.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StudentFindUniqueArgs>(args: SelectSubset<T, StudentFindUniqueArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Student that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StudentFindUniqueOrThrowArgs} args - Arguments to find a Student
     * @example
     * // Get one Student
     * const student = await prisma.student.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StudentFindUniqueOrThrowArgs>(args: SelectSubset<T, StudentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Student that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentFindFirstArgs} args - Arguments to find a Student
     * @example
     * // Get one Student
     * const student = await prisma.student.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StudentFindFirstArgs>(args?: SelectSubset<T, StudentFindFirstArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Student that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentFindFirstOrThrowArgs} args - Arguments to find a Student
     * @example
     * // Get one Student
     * const student = await prisma.student.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StudentFindFirstOrThrowArgs>(args?: SelectSubset<T, StudentFindFirstOrThrowArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Students that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Students
     * const students = await prisma.student.findMany()
     * 
     * // Get first 10 Students
     * const students = await prisma.student.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const studentWithIdOnly = await prisma.student.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StudentFindManyArgs>(args?: SelectSubset<T, StudentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Student.
     * @param {StudentCreateArgs} args - Arguments to create a Student.
     * @example
     * // Create one Student
     * const Student = await prisma.student.create({
     *   data: {
     *     // ... data to create a Student
     *   }
     * })
     * 
     */
    create<T extends StudentCreateArgs>(args: SelectSubset<T, StudentCreateArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Students.
     * @param {StudentCreateManyArgs} args - Arguments to create many Students.
     * @example
     * // Create many Students
     * const student = await prisma.student.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StudentCreateManyArgs>(args?: SelectSubset<T, StudentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Students and returns the data saved in the database.
     * @param {StudentCreateManyAndReturnArgs} args - Arguments to create many Students.
     * @example
     * // Create many Students
     * const student = await prisma.student.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Students and only return the `id`
     * const studentWithIdOnly = await prisma.student.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StudentCreateManyAndReturnArgs>(args?: SelectSubset<T, StudentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Student.
     * @param {StudentDeleteArgs} args - Arguments to delete one Student.
     * @example
     * // Delete one Student
     * const Student = await prisma.student.delete({
     *   where: {
     *     // ... filter to delete one Student
     *   }
     * })
     * 
     */
    delete<T extends StudentDeleteArgs>(args: SelectSubset<T, StudentDeleteArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Student.
     * @param {StudentUpdateArgs} args - Arguments to update one Student.
     * @example
     * // Update one Student
     * const student = await prisma.student.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StudentUpdateArgs>(args: SelectSubset<T, StudentUpdateArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Students.
     * @param {StudentDeleteManyArgs} args - Arguments to filter Students to delete.
     * @example
     * // Delete a few Students
     * const { count } = await prisma.student.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StudentDeleteManyArgs>(args?: SelectSubset<T, StudentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Students.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Students
     * const student = await prisma.student.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StudentUpdateManyArgs>(args: SelectSubset<T, StudentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Students and returns the data updated in the database.
     * @param {StudentUpdateManyAndReturnArgs} args - Arguments to update many Students.
     * @example
     * // Update many Students
     * const student = await prisma.student.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Students and only return the `id`
     * const studentWithIdOnly = await prisma.student.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends StudentUpdateManyAndReturnArgs>(args: SelectSubset<T, StudentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Student.
     * @param {StudentUpsertArgs} args - Arguments to update or create a Student.
     * @example
     * // Update or create a Student
     * const student = await prisma.student.upsert({
     *   create: {
     *     // ... data to create a Student
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Student we want to update
     *   }
     * })
     */
    upsert<T extends StudentUpsertArgs>(args: SelectSubset<T, StudentUpsertArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Students.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentCountArgs} args - Arguments to filter Students to count.
     * @example
     * // Count the number of Students
     * const count = await prisma.student.count({
     *   where: {
     *     // ... the filter for the Students we want to count
     *   }
     * })
    **/
    count<T extends StudentCountArgs>(
      args?: Subset<T, StudentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StudentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Student.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StudentAggregateArgs>(args: Subset<T, StudentAggregateArgs>): Prisma.PrismaPromise<GetStudentAggregateType<T>>

    /**
     * Group by Student.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StudentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StudentGroupByArgs['orderBy'] }
        : { orderBy?: StudentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StudentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStudentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Student model
   */
  readonly fields: StudentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Student.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StudentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    tempatPkl<T extends Student$tempatPklArgs<ExtArgs> = {}>(args?: Subset<T, Student$tempatPklArgs<ExtArgs>>): Prisma__TempatPklClient<$Result.GetResult<Prisma.$TempatPklPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    jurnals<T extends Student$jurnalsArgs<ExtArgs> = {}>(args?: Subset<T, Student$jurnalsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JurnalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Student model
   */
  interface StudentFieldRefs {
    readonly id: FieldRef<"Student", 'String'>
    readonly userId: FieldRef<"Student", 'String'>
    readonly nisn: FieldRef<"Student", 'String'>
    readonly kelas: FieldRef<"Student", 'String'>
    readonly jurusan: FieldRef<"Student", 'String'>
    readonly tempatPklId: FieldRef<"Student", 'String'>
    readonly createdAt: FieldRef<"Student", 'DateTime'>
    readonly updatedAt: FieldRef<"Student", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Student findUnique
   */
  export type StudentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * Filter, which Student to fetch.
     */
    where: StudentWhereUniqueInput
  }

  /**
   * Student findUniqueOrThrow
   */
  export type StudentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * Filter, which Student to fetch.
     */
    where: StudentWhereUniqueInput
  }

  /**
   * Student findFirst
   */
  export type StudentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * Filter, which Student to fetch.
     */
    where?: StudentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Students to fetch.
     */
    orderBy?: StudentOrderByWithRelationInput | StudentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Students.
     */
    cursor?: StudentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Students from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Students.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Students.
     */
    distinct?: StudentScalarFieldEnum | StudentScalarFieldEnum[]
  }

  /**
   * Student findFirstOrThrow
   */
  export type StudentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * Filter, which Student to fetch.
     */
    where?: StudentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Students to fetch.
     */
    orderBy?: StudentOrderByWithRelationInput | StudentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Students.
     */
    cursor?: StudentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Students from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Students.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Students.
     */
    distinct?: StudentScalarFieldEnum | StudentScalarFieldEnum[]
  }

  /**
   * Student findMany
   */
  export type StudentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * Filter, which Students to fetch.
     */
    where?: StudentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Students to fetch.
     */
    orderBy?: StudentOrderByWithRelationInput | StudentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Students.
     */
    cursor?: StudentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Students from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Students.
     */
    skip?: number
    distinct?: StudentScalarFieldEnum | StudentScalarFieldEnum[]
  }

  /**
   * Student create
   */
  export type StudentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * The data needed to create a Student.
     */
    data: XOR<StudentCreateInput, StudentUncheckedCreateInput>
  }

  /**
   * Student createMany
   */
  export type StudentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Students.
     */
    data: StudentCreateManyInput | StudentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Student createManyAndReturn
   */
  export type StudentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * The data used to create many Students.
     */
    data: StudentCreateManyInput | StudentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Student update
   */
  export type StudentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * The data needed to update a Student.
     */
    data: XOR<StudentUpdateInput, StudentUncheckedUpdateInput>
    /**
     * Choose, which Student to update.
     */
    where: StudentWhereUniqueInput
  }

  /**
   * Student updateMany
   */
  export type StudentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Students.
     */
    data: XOR<StudentUpdateManyMutationInput, StudentUncheckedUpdateManyInput>
    /**
     * Filter which Students to update
     */
    where?: StudentWhereInput
    /**
     * Limit how many Students to update.
     */
    limit?: number
  }

  /**
   * Student updateManyAndReturn
   */
  export type StudentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * The data used to update Students.
     */
    data: XOR<StudentUpdateManyMutationInput, StudentUncheckedUpdateManyInput>
    /**
     * Filter which Students to update
     */
    where?: StudentWhereInput
    /**
     * Limit how many Students to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Student upsert
   */
  export type StudentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * The filter to search for the Student to update in case it exists.
     */
    where: StudentWhereUniqueInput
    /**
     * In case the Student found by the `where` argument doesn't exist, create a new Student with this data.
     */
    create: XOR<StudentCreateInput, StudentUncheckedCreateInput>
    /**
     * In case the Student was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StudentUpdateInput, StudentUncheckedUpdateInput>
  }

  /**
   * Student delete
   */
  export type StudentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * Filter which Student to delete.
     */
    where: StudentWhereUniqueInput
  }

  /**
   * Student deleteMany
   */
  export type StudentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Students to delete
     */
    where?: StudentWhereInput
    /**
     * Limit how many Students to delete.
     */
    limit?: number
  }

  /**
   * Student.tempatPkl
   */
  export type Student$tempatPklArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TempatPkl
     */
    select?: TempatPklSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TempatPkl
     */
    omit?: TempatPklOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TempatPklInclude<ExtArgs> | null
    where?: TempatPklWhereInput
  }

  /**
   * Student.jurnals
   */
  export type Student$jurnalsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Jurnal
     */
    select?: JurnalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Jurnal
     */
    omit?: JurnalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JurnalInclude<ExtArgs> | null
    where?: JurnalWhereInput
    orderBy?: JurnalOrderByWithRelationInput | JurnalOrderByWithRelationInput[]
    cursor?: JurnalWhereUniqueInput
    take?: number
    skip?: number
    distinct?: JurnalScalarFieldEnum | JurnalScalarFieldEnum[]
  }

  /**
   * Student without action
   */
  export type StudentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
  }


  /**
   * Model Teacher
   */

  export type AggregateTeacher = {
    _count: TeacherCountAggregateOutputType | null
    _min: TeacherMinAggregateOutputType | null
    _max: TeacherMaxAggregateOutputType | null
  }

  export type TeacherMinAggregateOutputType = {
    id: string | null
    userId: string | null
    nip: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TeacherMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    nip: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TeacherCountAggregateOutputType = {
    id: number
    userId: number
    nip: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TeacherMinAggregateInputType = {
    id?: true
    userId?: true
    nip?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TeacherMaxAggregateInputType = {
    id?: true
    userId?: true
    nip?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TeacherCountAggregateInputType = {
    id?: true
    userId?: true
    nip?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TeacherAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Teacher to aggregate.
     */
    where?: TeacherWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teachers to fetch.
     */
    orderBy?: TeacherOrderByWithRelationInput | TeacherOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TeacherWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teachers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teachers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Teachers
    **/
    _count?: true | TeacherCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TeacherMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TeacherMaxAggregateInputType
  }

  export type GetTeacherAggregateType<T extends TeacherAggregateArgs> = {
        [P in keyof T & keyof AggregateTeacher]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTeacher[P]>
      : GetScalarType<T[P], AggregateTeacher[P]>
  }




  export type TeacherGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TeacherWhereInput
    orderBy?: TeacherOrderByWithAggregationInput | TeacherOrderByWithAggregationInput[]
    by: TeacherScalarFieldEnum[] | TeacherScalarFieldEnum
    having?: TeacherScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TeacherCountAggregateInputType | true
    _min?: TeacherMinAggregateInputType
    _max?: TeacherMaxAggregateInputType
  }

  export type TeacherGroupByOutputType = {
    id: string
    userId: string
    nip: string
    createdAt: Date
    updatedAt: Date
    _count: TeacherCountAggregateOutputType | null
    _min: TeacherMinAggregateOutputType | null
    _max: TeacherMaxAggregateOutputType | null
  }

  type GetTeacherGroupByPayload<T extends TeacherGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TeacherGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TeacherGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TeacherGroupByOutputType[P]>
            : GetScalarType<T[P], TeacherGroupByOutputType[P]>
        }
      >
    >


  export type TeacherSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    nip?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    comments?: boolean | Teacher$commentsArgs<ExtArgs>
    _count?: boolean | TeacherCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["teacher"]>

  export type TeacherSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    nip?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["teacher"]>

  export type TeacherSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    nip?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["teacher"]>

  export type TeacherSelectScalar = {
    id?: boolean
    userId?: boolean
    nip?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TeacherOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "nip" | "createdAt" | "updatedAt", ExtArgs["result"]["teacher"]>
  export type TeacherInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    comments?: boolean | Teacher$commentsArgs<ExtArgs>
    _count?: boolean | TeacherCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TeacherIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TeacherIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $TeacherPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Teacher"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      comments: Prisma.$JurnalCommentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      nip: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["teacher"]>
    composites: {}
  }

  type TeacherGetPayload<S extends boolean | null | undefined | TeacherDefaultArgs> = $Result.GetResult<Prisma.$TeacherPayload, S>

  type TeacherCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TeacherFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TeacherCountAggregateInputType | true
    }

  export interface TeacherDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Teacher'], meta: { name: 'Teacher' } }
    /**
     * Find zero or one Teacher that matches the filter.
     * @param {TeacherFindUniqueArgs} args - Arguments to find a Teacher
     * @example
     * // Get one Teacher
     * const teacher = await prisma.teacher.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TeacherFindUniqueArgs>(args: SelectSubset<T, TeacherFindUniqueArgs<ExtArgs>>): Prisma__TeacherClient<$Result.GetResult<Prisma.$TeacherPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Teacher that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TeacherFindUniqueOrThrowArgs} args - Arguments to find a Teacher
     * @example
     * // Get one Teacher
     * const teacher = await prisma.teacher.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TeacherFindUniqueOrThrowArgs>(args: SelectSubset<T, TeacherFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TeacherClient<$Result.GetResult<Prisma.$TeacherPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Teacher that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeacherFindFirstArgs} args - Arguments to find a Teacher
     * @example
     * // Get one Teacher
     * const teacher = await prisma.teacher.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TeacherFindFirstArgs>(args?: SelectSubset<T, TeacherFindFirstArgs<ExtArgs>>): Prisma__TeacherClient<$Result.GetResult<Prisma.$TeacherPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Teacher that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeacherFindFirstOrThrowArgs} args - Arguments to find a Teacher
     * @example
     * // Get one Teacher
     * const teacher = await prisma.teacher.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TeacherFindFirstOrThrowArgs>(args?: SelectSubset<T, TeacherFindFirstOrThrowArgs<ExtArgs>>): Prisma__TeacherClient<$Result.GetResult<Prisma.$TeacherPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Teachers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeacherFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Teachers
     * const teachers = await prisma.teacher.findMany()
     * 
     * // Get first 10 Teachers
     * const teachers = await prisma.teacher.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const teacherWithIdOnly = await prisma.teacher.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TeacherFindManyArgs>(args?: SelectSubset<T, TeacherFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeacherPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Teacher.
     * @param {TeacherCreateArgs} args - Arguments to create a Teacher.
     * @example
     * // Create one Teacher
     * const Teacher = await prisma.teacher.create({
     *   data: {
     *     // ... data to create a Teacher
     *   }
     * })
     * 
     */
    create<T extends TeacherCreateArgs>(args: SelectSubset<T, TeacherCreateArgs<ExtArgs>>): Prisma__TeacherClient<$Result.GetResult<Prisma.$TeacherPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Teachers.
     * @param {TeacherCreateManyArgs} args - Arguments to create many Teachers.
     * @example
     * // Create many Teachers
     * const teacher = await prisma.teacher.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TeacherCreateManyArgs>(args?: SelectSubset<T, TeacherCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Teachers and returns the data saved in the database.
     * @param {TeacherCreateManyAndReturnArgs} args - Arguments to create many Teachers.
     * @example
     * // Create many Teachers
     * const teacher = await prisma.teacher.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Teachers and only return the `id`
     * const teacherWithIdOnly = await prisma.teacher.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TeacherCreateManyAndReturnArgs>(args?: SelectSubset<T, TeacherCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeacherPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Teacher.
     * @param {TeacherDeleteArgs} args - Arguments to delete one Teacher.
     * @example
     * // Delete one Teacher
     * const Teacher = await prisma.teacher.delete({
     *   where: {
     *     // ... filter to delete one Teacher
     *   }
     * })
     * 
     */
    delete<T extends TeacherDeleteArgs>(args: SelectSubset<T, TeacherDeleteArgs<ExtArgs>>): Prisma__TeacherClient<$Result.GetResult<Prisma.$TeacherPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Teacher.
     * @param {TeacherUpdateArgs} args - Arguments to update one Teacher.
     * @example
     * // Update one Teacher
     * const teacher = await prisma.teacher.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TeacherUpdateArgs>(args: SelectSubset<T, TeacherUpdateArgs<ExtArgs>>): Prisma__TeacherClient<$Result.GetResult<Prisma.$TeacherPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Teachers.
     * @param {TeacherDeleteManyArgs} args - Arguments to filter Teachers to delete.
     * @example
     * // Delete a few Teachers
     * const { count } = await prisma.teacher.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TeacherDeleteManyArgs>(args?: SelectSubset<T, TeacherDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Teachers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeacherUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Teachers
     * const teacher = await prisma.teacher.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TeacherUpdateManyArgs>(args: SelectSubset<T, TeacherUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Teachers and returns the data updated in the database.
     * @param {TeacherUpdateManyAndReturnArgs} args - Arguments to update many Teachers.
     * @example
     * // Update many Teachers
     * const teacher = await prisma.teacher.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Teachers and only return the `id`
     * const teacherWithIdOnly = await prisma.teacher.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TeacherUpdateManyAndReturnArgs>(args: SelectSubset<T, TeacherUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeacherPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Teacher.
     * @param {TeacherUpsertArgs} args - Arguments to update or create a Teacher.
     * @example
     * // Update or create a Teacher
     * const teacher = await prisma.teacher.upsert({
     *   create: {
     *     // ... data to create a Teacher
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Teacher we want to update
     *   }
     * })
     */
    upsert<T extends TeacherUpsertArgs>(args: SelectSubset<T, TeacherUpsertArgs<ExtArgs>>): Prisma__TeacherClient<$Result.GetResult<Prisma.$TeacherPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Teachers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeacherCountArgs} args - Arguments to filter Teachers to count.
     * @example
     * // Count the number of Teachers
     * const count = await prisma.teacher.count({
     *   where: {
     *     // ... the filter for the Teachers we want to count
     *   }
     * })
    **/
    count<T extends TeacherCountArgs>(
      args?: Subset<T, TeacherCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TeacherCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Teacher.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeacherAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TeacherAggregateArgs>(args: Subset<T, TeacherAggregateArgs>): Prisma.PrismaPromise<GetTeacherAggregateType<T>>

    /**
     * Group by Teacher.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeacherGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TeacherGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TeacherGroupByArgs['orderBy'] }
        : { orderBy?: TeacherGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TeacherGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTeacherGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Teacher model
   */
  readonly fields: TeacherFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Teacher.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TeacherClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    comments<T extends Teacher$commentsArgs<ExtArgs> = {}>(args?: Subset<T, Teacher$commentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JurnalCommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Teacher model
   */
  interface TeacherFieldRefs {
    readonly id: FieldRef<"Teacher", 'String'>
    readonly userId: FieldRef<"Teacher", 'String'>
    readonly nip: FieldRef<"Teacher", 'String'>
    readonly createdAt: FieldRef<"Teacher", 'DateTime'>
    readonly updatedAt: FieldRef<"Teacher", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Teacher findUnique
   */
  export type TeacherFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Teacher
     */
    select?: TeacherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Teacher
     */
    omit?: TeacherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeacherInclude<ExtArgs> | null
    /**
     * Filter, which Teacher to fetch.
     */
    where: TeacherWhereUniqueInput
  }

  /**
   * Teacher findUniqueOrThrow
   */
  export type TeacherFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Teacher
     */
    select?: TeacherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Teacher
     */
    omit?: TeacherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeacherInclude<ExtArgs> | null
    /**
     * Filter, which Teacher to fetch.
     */
    where: TeacherWhereUniqueInput
  }

  /**
   * Teacher findFirst
   */
  export type TeacherFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Teacher
     */
    select?: TeacherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Teacher
     */
    omit?: TeacherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeacherInclude<ExtArgs> | null
    /**
     * Filter, which Teacher to fetch.
     */
    where?: TeacherWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teachers to fetch.
     */
    orderBy?: TeacherOrderByWithRelationInput | TeacherOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Teachers.
     */
    cursor?: TeacherWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teachers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teachers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Teachers.
     */
    distinct?: TeacherScalarFieldEnum | TeacherScalarFieldEnum[]
  }

  /**
   * Teacher findFirstOrThrow
   */
  export type TeacherFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Teacher
     */
    select?: TeacherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Teacher
     */
    omit?: TeacherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeacherInclude<ExtArgs> | null
    /**
     * Filter, which Teacher to fetch.
     */
    where?: TeacherWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teachers to fetch.
     */
    orderBy?: TeacherOrderByWithRelationInput | TeacherOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Teachers.
     */
    cursor?: TeacherWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teachers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teachers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Teachers.
     */
    distinct?: TeacherScalarFieldEnum | TeacherScalarFieldEnum[]
  }

  /**
   * Teacher findMany
   */
  export type TeacherFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Teacher
     */
    select?: TeacherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Teacher
     */
    omit?: TeacherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeacherInclude<ExtArgs> | null
    /**
     * Filter, which Teachers to fetch.
     */
    where?: TeacherWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teachers to fetch.
     */
    orderBy?: TeacherOrderByWithRelationInput | TeacherOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Teachers.
     */
    cursor?: TeacherWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teachers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teachers.
     */
    skip?: number
    distinct?: TeacherScalarFieldEnum | TeacherScalarFieldEnum[]
  }

  /**
   * Teacher create
   */
  export type TeacherCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Teacher
     */
    select?: TeacherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Teacher
     */
    omit?: TeacherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeacherInclude<ExtArgs> | null
    /**
     * The data needed to create a Teacher.
     */
    data: XOR<TeacherCreateInput, TeacherUncheckedCreateInput>
  }

  /**
   * Teacher createMany
   */
  export type TeacherCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Teachers.
     */
    data: TeacherCreateManyInput | TeacherCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Teacher createManyAndReturn
   */
  export type TeacherCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Teacher
     */
    select?: TeacherSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Teacher
     */
    omit?: TeacherOmit<ExtArgs> | null
    /**
     * The data used to create many Teachers.
     */
    data: TeacherCreateManyInput | TeacherCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeacherIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Teacher update
   */
  export type TeacherUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Teacher
     */
    select?: TeacherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Teacher
     */
    omit?: TeacherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeacherInclude<ExtArgs> | null
    /**
     * The data needed to update a Teacher.
     */
    data: XOR<TeacherUpdateInput, TeacherUncheckedUpdateInput>
    /**
     * Choose, which Teacher to update.
     */
    where: TeacherWhereUniqueInput
  }

  /**
   * Teacher updateMany
   */
  export type TeacherUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Teachers.
     */
    data: XOR<TeacherUpdateManyMutationInput, TeacherUncheckedUpdateManyInput>
    /**
     * Filter which Teachers to update
     */
    where?: TeacherWhereInput
    /**
     * Limit how many Teachers to update.
     */
    limit?: number
  }

  /**
   * Teacher updateManyAndReturn
   */
  export type TeacherUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Teacher
     */
    select?: TeacherSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Teacher
     */
    omit?: TeacherOmit<ExtArgs> | null
    /**
     * The data used to update Teachers.
     */
    data: XOR<TeacherUpdateManyMutationInput, TeacherUncheckedUpdateManyInput>
    /**
     * Filter which Teachers to update
     */
    where?: TeacherWhereInput
    /**
     * Limit how many Teachers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeacherIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Teacher upsert
   */
  export type TeacherUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Teacher
     */
    select?: TeacherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Teacher
     */
    omit?: TeacherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeacherInclude<ExtArgs> | null
    /**
     * The filter to search for the Teacher to update in case it exists.
     */
    where: TeacherWhereUniqueInput
    /**
     * In case the Teacher found by the `where` argument doesn't exist, create a new Teacher with this data.
     */
    create: XOR<TeacherCreateInput, TeacherUncheckedCreateInput>
    /**
     * In case the Teacher was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TeacherUpdateInput, TeacherUncheckedUpdateInput>
  }

  /**
   * Teacher delete
   */
  export type TeacherDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Teacher
     */
    select?: TeacherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Teacher
     */
    omit?: TeacherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeacherInclude<ExtArgs> | null
    /**
     * Filter which Teacher to delete.
     */
    where: TeacherWhereUniqueInput
  }

  /**
   * Teacher deleteMany
   */
  export type TeacherDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Teachers to delete
     */
    where?: TeacherWhereInput
    /**
     * Limit how many Teachers to delete.
     */
    limit?: number
  }

  /**
   * Teacher.comments
   */
  export type Teacher$commentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JurnalComment
     */
    select?: JurnalCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JurnalComment
     */
    omit?: JurnalCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JurnalCommentInclude<ExtArgs> | null
    where?: JurnalCommentWhereInput
    orderBy?: JurnalCommentOrderByWithRelationInput | JurnalCommentOrderByWithRelationInput[]
    cursor?: JurnalCommentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: JurnalCommentScalarFieldEnum | JurnalCommentScalarFieldEnum[]
  }

  /**
   * Teacher without action
   */
  export type TeacherDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Teacher
     */
    select?: TeacherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Teacher
     */
    omit?: TeacherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeacherInclude<ExtArgs> | null
  }


  /**
   * Model TempatPkl
   */

  export type AggregateTempatPkl = {
    _count: TempatPklCountAggregateOutputType | null
    _min: TempatPklMinAggregateOutputType | null
    _max: TempatPklMaxAggregateOutputType | null
  }

  export type TempatPklMinAggregateOutputType = {
    id: string | null
    nama: string | null
    alamat: string | null
    telepon: string | null
    email: string | null
    namaContact: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TempatPklMaxAggregateOutputType = {
    id: string | null
    nama: string | null
    alamat: string | null
    telepon: string | null
    email: string | null
    namaContact: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TempatPklCountAggregateOutputType = {
    id: number
    nama: number
    alamat: number
    telepon: number
    email: number
    namaContact: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TempatPklMinAggregateInputType = {
    id?: true
    nama?: true
    alamat?: true
    telepon?: true
    email?: true
    namaContact?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TempatPklMaxAggregateInputType = {
    id?: true
    nama?: true
    alamat?: true
    telepon?: true
    email?: true
    namaContact?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TempatPklCountAggregateInputType = {
    id?: true
    nama?: true
    alamat?: true
    telepon?: true
    email?: true
    namaContact?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TempatPklAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TempatPkl to aggregate.
     */
    where?: TempatPklWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TempatPkls to fetch.
     */
    orderBy?: TempatPklOrderByWithRelationInput | TempatPklOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TempatPklWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TempatPkls from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TempatPkls.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TempatPkls
    **/
    _count?: true | TempatPklCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TempatPklMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TempatPklMaxAggregateInputType
  }

  export type GetTempatPklAggregateType<T extends TempatPklAggregateArgs> = {
        [P in keyof T & keyof AggregateTempatPkl]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTempatPkl[P]>
      : GetScalarType<T[P], AggregateTempatPkl[P]>
  }




  export type TempatPklGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TempatPklWhereInput
    orderBy?: TempatPklOrderByWithAggregationInput | TempatPklOrderByWithAggregationInput[]
    by: TempatPklScalarFieldEnum[] | TempatPklScalarFieldEnum
    having?: TempatPklScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TempatPklCountAggregateInputType | true
    _min?: TempatPklMinAggregateInputType
    _max?: TempatPklMaxAggregateInputType
  }

  export type TempatPklGroupByOutputType = {
    id: string
    nama: string
    alamat: string
    telepon: string | null
    email: string | null
    namaContact: string | null
    createdAt: Date
    updatedAt: Date
    _count: TempatPklCountAggregateOutputType | null
    _min: TempatPklMinAggregateOutputType | null
    _max: TempatPklMaxAggregateOutputType | null
  }

  type GetTempatPklGroupByPayload<T extends TempatPklGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TempatPklGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TempatPklGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TempatPklGroupByOutputType[P]>
            : GetScalarType<T[P], TempatPklGroupByOutputType[P]>
        }
      >
    >


  export type TempatPklSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nama?: boolean
    alamat?: boolean
    telepon?: boolean
    email?: boolean
    namaContact?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    students?: boolean | TempatPkl$studentsArgs<ExtArgs>
    _count?: boolean | TempatPklCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tempatPkl"]>

  export type TempatPklSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nama?: boolean
    alamat?: boolean
    telepon?: boolean
    email?: boolean
    namaContact?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["tempatPkl"]>

  export type TempatPklSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nama?: boolean
    alamat?: boolean
    telepon?: boolean
    email?: boolean
    namaContact?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["tempatPkl"]>

  export type TempatPklSelectScalar = {
    id?: boolean
    nama?: boolean
    alamat?: boolean
    telepon?: boolean
    email?: boolean
    namaContact?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TempatPklOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nama" | "alamat" | "telepon" | "email" | "namaContact" | "createdAt" | "updatedAt", ExtArgs["result"]["tempatPkl"]>
  export type TempatPklInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    students?: boolean | TempatPkl$studentsArgs<ExtArgs>
    _count?: boolean | TempatPklCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TempatPklIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type TempatPklIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TempatPklPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TempatPkl"
    objects: {
      students: Prisma.$StudentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      nama: string
      alamat: string
      telepon: string | null
      email: string | null
      namaContact: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["tempatPkl"]>
    composites: {}
  }

  type TempatPklGetPayload<S extends boolean | null | undefined | TempatPklDefaultArgs> = $Result.GetResult<Prisma.$TempatPklPayload, S>

  type TempatPklCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TempatPklFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TempatPklCountAggregateInputType | true
    }

  export interface TempatPklDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TempatPkl'], meta: { name: 'TempatPkl' } }
    /**
     * Find zero or one TempatPkl that matches the filter.
     * @param {TempatPklFindUniqueArgs} args - Arguments to find a TempatPkl
     * @example
     * // Get one TempatPkl
     * const tempatPkl = await prisma.tempatPkl.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TempatPklFindUniqueArgs>(args: SelectSubset<T, TempatPklFindUniqueArgs<ExtArgs>>): Prisma__TempatPklClient<$Result.GetResult<Prisma.$TempatPklPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TempatPkl that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TempatPklFindUniqueOrThrowArgs} args - Arguments to find a TempatPkl
     * @example
     * // Get one TempatPkl
     * const tempatPkl = await prisma.tempatPkl.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TempatPklFindUniqueOrThrowArgs>(args: SelectSubset<T, TempatPklFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TempatPklClient<$Result.GetResult<Prisma.$TempatPklPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TempatPkl that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TempatPklFindFirstArgs} args - Arguments to find a TempatPkl
     * @example
     * // Get one TempatPkl
     * const tempatPkl = await prisma.tempatPkl.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TempatPklFindFirstArgs>(args?: SelectSubset<T, TempatPklFindFirstArgs<ExtArgs>>): Prisma__TempatPklClient<$Result.GetResult<Prisma.$TempatPklPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TempatPkl that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TempatPklFindFirstOrThrowArgs} args - Arguments to find a TempatPkl
     * @example
     * // Get one TempatPkl
     * const tempatPkl = await prisma.tempatPkl.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TempatPklFindFirstOrThrowArgs>(args?: SelectSubset<T, TempatPklFindFirstOrThrowArgs<ExtArgs>>): Prisma__TempatPklClient<$Result.GetResult<Prisma.$TempatPklPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TempatPkls that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TempatPklFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TempatPkls
     * const tempatPkls = await prisma.tempatPkl.findMany()
     * 
     * // Get first 10 TempatPkls
     * const tempatPkls = await prisma.tempatPkl.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tempatPklWithIdOnly = await prisma.tempatPkl.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TempatPklFindManyArgs>(args?: SelectSubset<T, TempatPklFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TempatPklPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TempatPkl.
     * @param {TempatPklCreateArgs} args - Arguments to create a TempatPkl.
     * @example
     * // Create one TempatPkl
     * const TempatPkl = await prisma.tempatPkl.create({
     *   data: {
     *     // ... data to create a TempatPkl
     *   }
     * })
     * 
     */
    create<T extends TempatPklCreateArgs>(args: SelectSubset<T, TempatPklCreateArgs<ExtArgs>>): Prisma__TempatPklClient<$Result.GetResult<Prisma.$TempatPklPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TempatPkls.
     * @param {TempatPklCreateManyArgs} args - Arguments to create many TempatPkls.
     * @example
     * // Create many TempatPkls
     * const tempatPkl = await prisma.tempatPkl.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TempatPklCreateManyArgs>(args?: SelectSubset<T, TempatPklCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TempatPkls and returns the data saved in the database.
     * @param {TempatPklCreateManyAndReturnArgs} args - Arguments to create many TempatPkls.
     * @example
     * // Create many TempatPkls
     * const tempatPkl = await prisma.tempatPkl.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TempatPkls and only return the `id`
     * const tempatPklWithIdOnly = await prisma.tempatPkl.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TempatPklCreateManyAndReturnArgs>(args?: SelectSubset<T, TempatPklCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TempatPklPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TempatPkl.
     * @param {TempatPklDeleteArgs} args - Arguments to delete one TempatPkl.
     * @example
     * // Delete one TempatPkl
     * const TempatPkl = await prisma.tempatPkl.delete({
     *   where: {
     *     // ... filter to delete one TempatPkl
     *   }
     * })
     * 
     */
    delete<T extends TempatPklDeleteArgs>(args: SelectSubset<T, TempatPklDeleteArgs<ExtArgs>>): Prisma__TempatPklClient<$Result.GetResult<Prisma.$TempatPklPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TempatPkl.
     * @param {TempatPklUpdateArgs} args - Arguments to update one TempatPkl.
     * @example
     * // Update one TempatPkl
     * const tempatPkl = await prisma.tempatPkl.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TempatPklUpdateArgs>(args: SelectSubset<T, TempatPklUpdateArgs<ExtArgs>>): Prisma__TempatPklClient<$Result.GetResult<Prisma.$TempatPklPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TempatPkls.
     * @param {TempatPklDeleteManyArgs} args - Arguments to filter TempatPkls to delete.
     * @example
     * // Delete a few TempatPkls
     * const { count } = await prisma.tempatPkl.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TempatPklDeleteManyArgs>(args?: SelectSubset<T, TempatPklDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TempatPkls.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TempatPklUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TempatPkls
     * const tempatPkl = await prisma.tempatPkl.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TempatPklUpdateManyArgs>(args: SelectSubset<T, TempatPklUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TempatPkls and returns the data updated in the database.
     * @param {TempatPklUpdateManyAndReturnArgs} args - Arguments to update many TempatPkls.
     * @example
     * // Update many TempatPkls
     * const tempatPkl = await prisma.tempatPkl.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TempatPkls and only return the `id`
     * const tempatPklWithIdOnly = await prisma.tempatPkl.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TempatPklUpdateManyAndReturnArgs>(args: SelectSubset<T, TempatPklUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TempatPklPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TempatPkl.
     * @param {TempatPklUpsertArgs} args - Arguments to update or create a TempatPkl.
     * @example
     * // Update or create a TempatPkl
     * const tempatPkl = await prisma.tempatPkl.upsert({
     *   create: {
     *     // ... data to create a TempatPkl
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TempatPkl we want to update
     *   }
     * })
     */
    upsert<T extends TempatPklUpsertArgs>(args: SelectSubset<T, TempatPklUpsertArgs<ExtArgs>>): Prisma__TempatPklClient<$Result.GetResult<Prisma.$TempatPklPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TempatPkls.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TempatPklCountArgs} args - Arguments to filter TempatPkls to count.
     * @example
     * // Count the number of TempatPkls
     * const count = await prisma.tempatPkl.count({
     *   where: {
     *     // ... the filter for the TempatPkls we want to count
     *   }
     * })
    **/
    count<T extends TempatPklCountArgs>(
      args?: Subset<T, TempatPklCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TempatPklCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TempatPkl.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TempatPklAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TempatPklAggregateArgs>(args: Subset<T, TempatPklAggregateArgs>): Prisma.PrismaPromise<GetTempatPklAggregateType<T>>

    /**
     * Group by TempatPkl.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TempatPklGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TempatPklGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TempatPklGroupByArgs['orderBy'] }
        : { orderBy?: TempatPklGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TempatPklGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTempatPklGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TempatPkl model
   */
  readonly fields: TempatPklFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TempatPkl.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TempatPklClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    students<T extends TempatPkl$studentsArgs<ExtArgs> = {}>(args?: Subset<T, TempatPkl$studentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TempatPkl model
   */
  interface TempatPklFieldRefs {
    readonly id: FieldRef<"TempatPkl", 'String'>
    readonly nama: FieldRef<"TempatPkl", 'String'>
    readonly alamat: FieldRef<"TempatPkl", 'String'>
    readonly telepon: FieldRef<"TempatPkl", 'String'>
    readonly email: FieldRef<"TempatPkl", 'String'>
    readonly namaContact: FieldRef<"TempatPkl", 'String'>
    readonly createdAt: FieldRef<"TempatPkl", 'DateTime'>
    readonly updatedAt: FieldRef<"TempatPkl", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TempatPkl findUnique
   */
  export type TempatPklFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TempatPkl
     */
    select?: TempatPklSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TempatPkl
     */
    omit?: TempatPklOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TempatPklInclude<ExtArgs> | null
    /**
     * Filter, which TempatPkl to fetch.
     */
    where: TempatPklWhereUniqueInput
  }

  /**
   * TempatPkl findUniqueOrThrow
   */
  export type TempatPklFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TempatPkl
     */
    select?: TempatPklSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TempatPkl
     */
    omit?: TempatPklOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TempatPklInclude<ExtArgs> | null
    /**
     * Filter, which TempatPkl to fetch.
     */
    where: TempatPklWhereUniqueInput
  }

  /**
   * TempatPkl findFirst
   */
  export type TempatPklFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TempatPkl
     */
    select?: TempatPklSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TempatPkl
     */
    omit?: TempatPklOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TempatPklInclude<ExtArgs> | null
    /**
     * Filter, which TempatPkl to fetch.
     */
    where?: TempatPklWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TempatPkls to fetch.
     */
    orderBy?: TempatPklOrderByWithRelationInput | TempatPklOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TempatPkls.
     */
    cursor?: TempatPklWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TempatPkls from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TempatPkls.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TempatPkls.
     */
    distinct?: TempatPklScalarFieldEnum | TempatPklScalarFieldEnum[]
  }

  /**
   * TempatPkl findFirstOrThrow
   */
  export type TempatPklFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TempatPkl
     */
    select?: TempatPklSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TempatPkl
     */
    omit?: TempatPklOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TempatPklInclude<ExtArgs> | null
    /**
     * Filter, which TempatPkl to fetch.
     */
    where?: TempatPklWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TempatPkls to fetch.
     */
    orderBy?: TempatPklOrderByWithRelationInput | TempatPklOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TempatPkls.
     */
    cursor?: TempatPklWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TempatPkls from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TempatPkls.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TempatPkls.
     */
    distinct?: TempatPklScalarFieldEnum | TempatPklScalarFieldEnum[]
  }

  /**
   * TempatPkl findMany
   */
  export type TempatPklFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TempatPkl
     */
    select?: TempatPklSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TempatPkl
     */
    omit?: TempatPklOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TempatPklInclude<ExtArgs> | null
    /**
     * Filter, which TempatPkls to fetch.
     */
    where?: TempatPklWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TempatPkls to fetch.
     */
    orderBy?: TempatPklOrderByWithRelationInput | TempatPklOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TempatPkls.
     */
    cursor?: TempatPklWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TempatPkls from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TempatPkls.
     */
    skip?: number
    distinct?: TempatPklScalarFieldEnum | TempatPklScalarFieldEnum[]
  }

  /**
   * TempatPkl create
   */
  export type TempatPklCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TempatPkl
     */
    select?: TempatPklSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TempatPkl
     */
    omit?: TempatPklOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TempatPklInclude<ExtArgs> | null
    /**
     * The data needed to create a TempatPkl.
     */
    data: XOR<TempatPklCreateInput, TempatPklUncheckedCreateInput>
  }

  /**
   * TempatPkl createMany
   */
  export type TempatPklCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TempatPkls.
     */
    data: TempatPklCreateManyInput | TempatPklCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TempatPkl createManyAndReturn
   */
  export type TempatPklCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TempatPkl
     */
    select?: TempatPklSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TempatPkl
     */
    omit?: TempatPklOmit<ExtArgs> | null
    /**
     * The data used to create many TempatPkls.
     */
    data: TempatPklCreateManyInput | TempatPklCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TempatPkl update
   */
  export type TempatPklUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TempatPkl
     */
    select?: TempatPklSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TempatPkl
     */
    omit?: TempatPklOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TempatPklInclude<ExtArgs> | null
    /**
     * The data needed to update a TempatPkl.
     */
    data: XOR<TempatPklUpdateInput, TempatPklUncheckedUpdateInput>
    /**
     * Choose, which TempatPkl to update.
     */
    where: TempatPklWhereUniqueInput
  }

  /**
   * TempatPkl updateMany
   */
  export type TempatPklUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TempatPkls.
     */
    data: XOR<TempatPklUpdateManyMutationInput, TempatPklUncheckedUpdateManyInput>
    /**
     * Filter which TempatPkls to update
     */
    where?: TempatPklWhereInput
    /**
     * Limit how many TempatPkls to update.
     */
    limit?: number
  }

  /**
   * TempatPkl updateManyAndReturn
   */
  export type TempatPklUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TempatPkl
     */
    select?: TempatPklSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TempatPkl
     */
    omit?: TempatPklOmit<ExtArgs> | null
    /**
     * The data used to update TempatPkls.
     */
    data: XOR<TempatPklUpdateManyMutationInput, TempatPklUncheckedUpdateManyInput>
    /**
     * Filter which TempatPkls to update
     */
    where?: TempatPklWhereInput
    /**
     * Limit how many TempatPkls to update.
     */
    limit?: number
  }

  /**
   * TempatPkl upsert
   */
  export type TempatPklUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TempatPkl
     */
    select?: TempatPklSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TempatPkl
     */
    omit?: TempatPklOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TempatPklInclude<ExtArgs> | null
    /**
     * The filter to search for the TempatPkl to update in case it exists.
     */
    where: TempatPklWhereUniqueInput
    /**
     * In case the TempatPkl found by the `where` argument doesn't exist, create a new TempatPkl with this data.
     */
    create: XOR<TempatPklCreateInput, TempatPklUncheckedCreateInput>
    /**
     * In case the TempatPkl was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TempatPklUpdateInput, TempatPklUncheckedUpdateInput>
  }

  /**
   * TempatPkl delete
   */
  export type TempatPklDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TempatPkl
     */
    select?: TempatPklSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TempatPkl
     */
    omit?: TempatPklOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TempatPklInclude<ExtArgs> | null
    /**
     * Filter which TempatPkl to delete.
     */
    where: TempatPklWhereUniqueInput
  }

  /**
   * TempatPkl deleteMany
   */
  export type TempatPklDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TempatPkls to delete
     */
    where?: TempatPklWhereInput
    /**
     * Limit how many TempatPkls to delete.
     */
    limit?: number
  }

  /**
   * TempatPkl.students
   */
  export type TempatPkl$studentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    where?: StudentWhereInput
    orderBy?: StudentOrderByWithRelationInput | StudentOrderByWithRelationInput[]
    cursor?: StudentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StudentScalarFieldEnum | StudentScalarFieldEnum[]
  }

  /**
   * TempatPkl without action
   */
  export type TempatPklDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TempatPkl
     */
    select?: TempatPklSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TempatPkl
     */
    omit?: TempatPklOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TempatPklInclude<ExtArgs> | null
  }


  /**
   * Model Jurnal
   */

  export type AggregateJurnal = {
    _count: JurnalCountAggregateOutputType | null
    _min: JurnalMinAggregateOutputType | null
    _max: JurnalMaxAggregateOutputType | null
  }

  export type JurnalMinAggregateOutputType = {
    id: string | null
    tanggal: Date | null
    kegiatan: string | null
    dokumentasi: string | null
    studentId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type JurnalMaxAggregateOutputType = {
    id: string | null
    tanggal: Date | null
    kegiatan: string | null
    dokumentasi: string | null
    studentId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type JurnalCountAggregateOutputType = {
    id: number
    tanggal: number
    kegiatan: number
    dokumentasi: number
    studentId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type JurnalMinAggregateInputType = {
    id?: true
    tanggal?: true
    kegiatan?: true
    dokumentasi?: true
    studentId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type JurnalMaxAggregateInputType = {
    id?: true
    tanggal?: true
    kegiatan?: true
    dokumentasi?: true
    studentId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type JurnalCountAggregateInputType = {
    id?: true
    tanggal?: true
    kegiatan?: true
    dokumentasi?: true
    studentId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type JurnalAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Jurnal to aggregate.
     */
    where?: JurnalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jurnals to fetch.
     */
    orderBy?: JurnalOrderByWithRelationInput | JurnalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: JurnalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jurnals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jurnals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Jurnals
    **/
    _count?: true | JurnalCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: JurnalMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: JurnalMaxAggregateInputType
  }

  export type GetJurnalAggregateType<T extends JurnalAggregateArgs> = {
        [P in keyof T & keyof AggregateJurnal]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateJurnal[P]>
      : GetScalarType<T[P], AggregateJurnal[P]>
  }




  export type JurnalGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JurnalWhereInput
    orderBy?: JurnalOrderByWithAggregationInput | JurnalOrderByWithAggregationInput[]
    by: JurnalScalarFieldEnum[] | JurnalScalarFieldEnum
    having?: JurnalScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: JurnalCountAggregateInputType | true
    _min?: JurnalMinAggregateInputType
    _max?: JurnalMaxAggregateInputType
  }

  export type JurnalGroupByOutputType = {
    id: string
    tanggal: Date
    kegiatan: string
    dokumentasi: string | null
    studentId: string
    createdAt: Date
    updatedAt: Date
    _count: JurnalCountAggregateOutputType | null
    _min: JurnalMinAggregateOutputType | null
    _max: JurnalMaxAggregateOutputType | null
  }

  type GetJurnalGroupByPayload<T extends JurnalGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<JurnalGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof JurnalGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], JurnalGroupByOutputType[P]>
            : GetScalarType<T[P], JurnalGroupByOutputType[P]>
        }
      >
    >


  export type JurnalSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tanggal?: boolean
    kegiatan?: boolean
    dokumentasi?: boolean
    studentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    student?: boolean | StudentDefaultArgs<ExtArgs>
    comments?: boolean | Jurnal$commentsArgs<ExtArgs>
    _count?: boolean | JurnalCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["jurnal"]>

  export type JurnalSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tanggal?: boolean
    kegiatan?: boolean
    dokumentasi?: boolean
    studentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["jurnal"]>

  export type JurnalSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tanggal?: boolean
    kegiatan?: boolean
    dokumentasi?: boolean
    studentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["jurnal"]>

  export type JurnalSelectScalar = {
    id?: boolean
    tanggal?: boolean
    kegiatan?: boolean
    dokumentasi?: boolean
    studentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type JurnalOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tanggal" | "kegiatan" | "dokumentasi" | "studentId" | "createdAt" | "updatedAt", ExtArgs["result"]["jurnal"]>
  export type JurnalInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StudentDefaultArgs<ExtArgs>
    comments?: boolean | Jurnal$commentsArgs<ExtArgs>
    _count?: boolean | JurnalCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type JurnalIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }
  export type JurnalIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }

  export type $JurnalPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Jurnal"
    objects: {
      student: Prisma.$StudentPayload<ExtArgs>
      comments: Prisma.$JurnalCommentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tanggal: Date
      kegiatan: string
      dokumentasi: string | null
      studentId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["jurnal"]>
    composites: {}
  }

  type JurnalGetPayload<S extends boolean | null | undefined | JurnalDefaultArgs> = $Result.GetResult<Prisma.$JurnalPayload, S>

  type JurnalCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<JurnalFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: JurnalCountAggregateInputType | true
    }

  export interface JurnalDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Jurnal'], meta: { name: 'Jurnal' } }
    /**
     * Find zero or one Jurnal that matches the filter.
     * @param {JurnalFindUniqueArgs} args - Arguments to find a Jurnal
     * @example
     * // Get one Jurnal
     * const jurnal = await prisma.jurnal.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends JurnalFindUniqueArgs>(args: SelectSubset<T, JurnalFindUniqueArgs<ExtArgs>>): Prisma__JurnalClient<$Result.GetResult<Prisma.$JurnalPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Jurnal that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {JurnalFindUniqueOrThrowArgs} args - Arguments to find a Jurnal
     * @example
     * // Get one Jurnal
     * const jurnal = await prisma.jurnal.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends JurnalFindUniqueOrThrowArgs>(args: SelectSubset<T, JurnalFindUniqueOrThrowArgs<ExtArgs>>): Prisma__JurnalClient<$Result.GetResult<Prisma.$JurnalPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Jurnal that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JurnalFindFirstArgs} args - Arguments to find a Jurnal
     * @example
     * // Get one Jurnal
     * const jurnal = await prisma.jurnal.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends JurnalFindFirstArgs>(args?: SelectSubset<T, JurnalFindFirstArgs<ExtArgs>>): Prisma__JurnalClient<$Result.GetResult<Prisma.$JurnalPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Jurnal that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JurnalFindFirstOrThrowArgs} args - Arguments to find a Jurnal
     * @example
     * // Get one Jurnal
     * const jurnal = await prisma.jurnal.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends JurnalFindFirstOrThrowArgs>(args?: SelectSubset<T, JurnalFindFirstOrThrowArgs<ExtArgs>>): Prisma__JurnalClient<$Result.GetResult<Prisma.$JurnalPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Jurnals that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JurnalFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Jurnals
     * const jurnals = await prisma.jurnal.findMany()
     * 
     * // Get first 10 Jurnals
     * const jurnals = await prisma.jurnal.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const jurnalWithIdOnly = await prisma.jurnal.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends JurnalFindManyArgs>(args?: SelectSubset<T, JurnalFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JurnalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Jurnal.
     * @param {JurnalCreateArgs} args - Arguments to create a Jurnal.
     * @example
     * // Create one Jurnal
     * const Jurnal = await prisma.jurnal.create({
     *   data: {
     *     // ... data to create a Jurnal
     *   }
     * })
     * 
     */
    create<T extends JurnalCreateArgs>(args: SelectSubset<T, JurnalCreateArgs<ExtArgs>>): Prisma__JurnalClient<$Result.GetResult<Prisma.$JurnalPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Jurnals.
     * @param {JurnalCreateManyArgs} args - Arguments to create many Jurnals.
     * @example
     * // Create many Jurnals
     * const jurnal = await prisma.jurnal.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends JurnalCreateManyArgs>(args?: SelectSubset<T, JurnalCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Jurnals and returns the data saved in the database.
     * @param {JurnalCreateManyAndReturnArgs} args - Arguments to create many Jurnals.
     * @example
     * // Create many Jurnals
     * const jurnal = await prisma.jurnal.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Jurnals and only return the `id`
     * const jurnalWithIdOnly = await prisma.jurnal.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends JurnalCreateManyAndReturnArgs>(args?: SelectSubset<T, JurnalCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JurnalPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Jurnal.
     * @param {JurnalDeleteArgs} args - Arguments to delete one Jurnal.
     * @example
     * // Delete one Jurnal
     * const Jurnal = await prisma.jurnal.delete({
     *   where: {
     *     // ... filter to delete one Jurnal
     *   }
     * })
     * 
     */
    delete<T extends JurnalDeleteArgs>(args: SelectSubset<T, JurnalDeleteArgs<ExtArgs>>): Prisma__JurnalClient<$Result.GetResult<Prisma.$JurnalPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Jurnal.
     * @param {JurnalUpdateArgs} args - Arguments to update one Jurnal.
     * @example
     * // Update one Jurnal
     * const jurnal = await prisma.jurnal.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends JurnalUpdateArgs>(args: SelectSubset<T, JurnalUpdateArgs<ExtArgs>>): Prisma__JurnalClient<$Result.GetResult<Prisma.$JurnalPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Jurnals.
     * @param {JurnalDeleteManyArgs} args - Arguments to filter Jurnals to delete.
     * @example
     * // Delete a few Jurnals
     * const { count } = await prisma.jurnal.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends JurnalDeleteManyArgs>(args?: SelectSubset<T, JurnalDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Jurnals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JurnalUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Jurnals
     * const jurnal = await prisma.jurnal.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends JurnalUpdateManyArgs>(args: SelectSubset<T, JurnalUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Jurnals and returns the data updated in the database.
     * @param {JurnalUpdateManyAndReturnArgs} args - Arguments to update many Jurnals.
     * @example
     * // Update many Jurnals
     * const jurnal = await prisma.jurnal.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Jurnals and only return the `id`
     * const jurnalWithIdOnly = await prisma.jurnal.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends JurnalUpdateManyAndReturnArgs>(args: SelectSubset<T, JurnalUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JurnalPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Jurnal.
     * @param {JurnalUpsertArgs} args - Arguments to update or create a Jurnal.
     * @example
     * // Update or create a Jurnal
     * const jurnal = await prisma.jurnal.upsert({
     *   create: {
     *     // ... data to create a Jurnal
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Jurnal we want to update
     *   }
     * })
     */
    upsert<T extends JurnalUpsertArgs>(args: SelectSubset<T, JurnalUpsertArgs<ExtArgs>>): Prisma__JurnalClient<$Result.GetResult<Prisma.$JurnalPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Jurnals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JurnalCountArgs} args - Arguments to filter Jurnals to count.
     * @example
     * // Count the number of Jurnals
     * const count = await prisma.jurnal.count({
     *   where: {
     *     // ... the filter for the Jurnals we want to count
     *   }
     * })
    **/
    count<T extends JurnalCountArgs>(
      args?: Subset<T, JurnalCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], JurnalCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Jurnal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JurnalAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends JurnalAggregateArgs>(args: Subset<T, JurnalAggregateArgs>): Prisma.PrismaPromise<GetJurnalAggregateType<T>>

    /**
     * Group by Jurnal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JurnalGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends JurnalGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: JurnalGroupByArgs['orderBy'] }
        : { orderBy?: JurnalGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, JurnalGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetJurnalGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Jurnal model
   */
  readonly fields: JurnalFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Jurnal.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__JurnalClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    student<T extends StudentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StudentDefaultArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    comments<T extends Jurnal$commentsArgs<ExtArgs> = {}>(args?: Subset<T, Jurnal$commentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JurnalCommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Jurnal model
   */
  interface JurnalFieldRefs {
    readonly id: FieldRef<"Jurnal", 'String'>
    readonly tanggal: FieldRef<"Jurnal", 'DateTime'>
    readonly kegiatan: FieldRef<"Jurnal", 'String'>
    readonly dokumentasi: FieldRef<"Jurnal", 'String'>
    readonly studentId: FieldRef<"Jurnal", 'String'>
    readonly createdAt: FieldRef<"Jurnal", 'DateTime'>
    readonly updatedAt: FieldRef<"Jurnal", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Jurnal findUnique
   */
  export type JurnalFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Jurnal
     */
    select?: JurnalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Jurnal
     */
    omit?: JurnalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JurnalInclude<ExtArgs> | null
    /**
     * Filter, which Jurnal to fetch.
     */
    where: JurnalWhereUniqueInput
  }

  /**
   * Jurnal findUniqueOrThrow
   */
  export type JurnalFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Jurnal
     */
    select?: JurnalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Jurnal
     */
    omit?: JurnalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JurnalInclude<ExtArgs> | null
    /**
     * Filter, which Jurnal to fetch.
     */
    where: JurnalWhereUniqueInput
  }

  /**
   * Jurnal findFirst
   */
  export type JurnalFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Jurnal
     */
    select?: JurnalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Jurnal
     */
    omit?: JurnalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JurnalInclude<ExtArgs> | null
    /**
     * Filter, which Jurnal to fetch.
     */
    where?: JurnalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jurnals to fetch.
     */
    orderBy?: JurnalOrderByWithRelationInput | JurnalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Jurnals.
     */
    cursor?: JurnalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jurnals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jurnals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Jurnals.
     */
    distinct?: JurnalScalarFieldEnum | JurnalScalarFieldEnum[]
  }

  /**
   * Jurnal findFirstOrThrow
   */
  export type JurnalFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Jurnal
     */
    select?: JurnalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Jurnal
     */
    omit?: JurnalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JurnalInclude<ExtArgs> | null
    /**
     * Filter, which Jurnal to fetch.
     */
    where?: JurnalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jurnals to fetch.
     */
    orderBy?: JurnalOrderByWithRelationInput | JurnalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Jurnals.
     */
    cursor?: JurnalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jurnals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jurnals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Jurnals.
     */
    distinct?: JurnalScalarFieldEnum | JurnalScalarFieldEnum[]
  }

  /**
   * Jurnal findMany
   */
  export type JurnalFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Jurnal
     */
    select?: JurnalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Jurnal
     */
    omit?: JurnalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JurnalInclude<ExtArgs> | null
    /**
     * Filter, which Jurnals to fetch.
     */
    where?: JurnalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jurnals to fetch.
     */
    orderBy?: JurnalOrderByWithRelationInput | JurnalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Jurnals.
     */
    cursor?: JurnalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jurnals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jurnals.
     */
    skip?: number
    distinct?: JurnalScalarFieldEnum | JurnalScalarFieldEnum[]
  }

  /**
   * Jurnal create
   */
  export type JurnalCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Jurnal
     */
    select?: JurnalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Jurnal
     */
    omit?: JurnalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JurnalInclude<ExtArgs> | null
    /**
     * The data needed to create a Jurnal.
     */
    data: XOR<JurnalCreateInput, JurnalUncheckedCreateInput>
  }

  /**
   * Jurnal createMany
   */
  export type JurnalCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Jurnals.
     */
    data: JurnalCreateManyInput | JurnalCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Jurnal createManyAndReturn
   */
  export type JurnalCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Jurnal
     */
    select?: JurnalSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Jurnal
     */
    omit?: JurnalOmit<ExtArgs> | null
    /**
     * The data used to create many Jurnals.
     */
    data: JurnalCreateManyInput | JurnalCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JurnalIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Jurnal update
   */
  export type JurnalUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Jurnal
     */
    select?: JurnalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Jurnal
     */
    omit?: JurnalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JurnalInclude<ExtArgs> | null
    /**
     * The data needed to update a Jurnal.
     */
    data: XOR<JurnalUpdateInput, JurnalUncheckedUpdateInput>
    /**
     * Choose, which Jurnal to update.
     */
    where: JurnalWhereUniqueInput
  }

  /**
   * Jurnal updateMany
   */
  export type JurnalUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Jurnals.
     */
    data: XOR<JurnalUpdateManyMutationInput, JurnalUncheckedUpdateManyInput>
    /**
     * Filter which Jurnals to update
     */
    where?: JurnalWhereInput
    /**
     * Limit how many Jurnals to update.
     */
    limit?: number
  }

  /**
   * Jurnal updateManyAndReturn
   */
  export type JurnalUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Jurnal
     */
    select?: JurnalSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Jurnal
     */
    omit?: JurnalOmit<ExtArgs> | null
    /**
     * The data used to update Jurnals.
     */
    data: XOR<JurnalUpdateManyMutationInput, JurnalUncheckedUpdateManyInput>
    /**
     * Filter which Jurnals to update
     */
    where?: JurnalWhereInput
    /**
     * Limit how many Jurnals to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JurnalIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Jurnal upsert
   */
  export type JurnalUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Jurnal
     */
    select?: JurnalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Jurnal
     */
    omit?: JurnalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JurnalInclude<ExtArgs> | null
    /**
     * The filter to search for the Jurnal to update in case it exists.
     */
    where: JurnalWhereUniqueInput
    /**
     * In case the Jurnal found by the `where` argument doesn't exist, create a new Jurnal with this data.
     */
    create: XOR<JurnalCreateInput, JurnalUncheckedCreateInput>
    /**
     * In case the Jurnal was found with the provided `where` argument, update it with this data.
     */
    update: XOR<JurnalUpdateInput, JurnalUncheckedUpdateInput>
  }

  /**
   * Jurnal delete
   */
  export type JurnalDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Jurnal
     */
    select?: JurnalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Jurnal
     */
    omit?: JurnalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JurnalInclude<ExtArgs> | null
    /**
     * Filter which Jurnal to delete.
     */
    where: JurnalWhereUniqueInput
  }

  /**
   * Jurnal deleteMany
   */
  export type JurnalDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Jurnals to delete
     */
    where?: JurnalWhereInput
    /**
     * Limit how many Jurnals to delete.
     */
    limit?: number
  }

  /**
   * Jurnal.comments
   */
  export type Jurnal$commentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JurnalComment
     */
    select?: JurnalCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JurnalComment
     */
    omit?: JurnalCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JurnalCommentInclude<ExtArgs> | null
    where?: JurnalCommentWhereInput
    orderBy?: JurnalCommentOrderByWithRelationInput | JurnalCommentOrderByWithRelationInput[]
    cursor?: JurnalCommentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: JurnalCommentScalarFieldEnum | JurnalCommentScalarFieldEnum[]
  }

  /**
   * Jurnal without action
   */
  export type JurnalDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Jurnal
     */
    select?: JurnalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Jurnal
     */
    omit?: JurnalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JurnalInclude<ExtArgs> | null
  }


  /**
   * Model JurnalComment
   */

  export type AggregateJurnalComment = {
    _count: JurnalCommentCountAggregateOutputType | null
    _min: JurnalCommentMinAggregateOutputType | null
    _max: JurnalCommentMaxAggregateOutputType | null
  }

  export type JurnalCommentMinAggregateOutputType = {
    id: string | null
    comment: string | null
    jurnalId: string | null
    teacherId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type JurnalCommentMaxAggregateOutputType = {
    id: string | null
    comment: string | null
    jurnalId: string | null
    teacherId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type JurnalCommentCountAggregateOutputType = {
    id: number
    comment: number
    jurnalId: number
    teacherId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type JurnalCommentMinAggregateInputType = {
    id?: true
    comment?: true
    jurnalId?: true
    teacherId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type JurnalCommentMaxAggregateInputType = {
    id?: true
    comment?: true
    jurnalId?: true
    teacherId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type JurnalCommentCountAggregateInputType = {
    id?: true
    comment?: true
    jurnalId?: true
    teacherId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type JurnalCommentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which JurnalComment to aggregate.
     */
    where?: JurnalCommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JurnalComments to fetch.
     */
    orderBy?: JurnalCommentOrderByWithRelationInput | JurnalCommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: JurnalCommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JurnalComments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JurnalComments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned JurnalComments
    **/
    _count?: true | JurnalCommentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: JurnalCommentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: JurnalCommentMaxAggregateInputType
  }

  export type GetJurnalCommentAggregateType<T extends JurnalCommentAggregateArgs> = {
        [P in keyof T & keyof AggregateJurnalComment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateJurnalComment[P]>
      : GetScalarType<T[P], AggregateJurnalComment[P]>
  }




  export type JurnalCommentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JurnalCommentWhereInput
    orderBy?: JurnalCommentOrderByWithAggregationInput | JurnalCommentOrderByWithAggregationInput[]
    by: JurnalCommentScalarFieldEnum[] | JurnalCommentScalarFieldEnum
    having?: JurnalCommentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: JurnalCommentCountAggregateInputType | true
    _min?: JurnalCommentMinAggregateInputType
    _max?: JurnalCommentMaxAggregateInputType
  }

  export type JurnalCommentGroupByOutputType = {
    id: string
    comment: string
    jurnalId: string
    teacherId: string
    createdAt: Date
    updatedAt: Date
    _count: JurnalCommentCountAggregateOutputType | null
    _min: JurnalCommentMinAggregateOutputType | null
    _max: JurnalCommentMaxAggregateOutputType | null
  }

  type GetJurnalCommentGroupByPayload<T extends JurnalCommentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<JurnalCommentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof JurnalCommentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], JurnalCommentGroupByOutputType[P]>
            : GetScalarType<T[P], JurnalCommentGroupByOutputType[P]>
        }
      >
    >


  export type JurnalCommentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    comment?: boolean
    jurnalId?: boolean
    teacherId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    jurnal?: boolean | JurnalDefaultArgs<ExtArgs>
    teacher?: boolean | TeacherDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["jurnalComment"]>

  export type JurnalCommentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    comment?: boolean
    jurnalId?: boolean
    teacherId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    jurnal?: boolean | JurnalDefaultArgs<ExtArgs>
    teacher?: boolean | TeacherDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["jurnalComment"]>

  export type JurnalCommentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    comment?: boolean
    jurnalId?: boolean
    teacherId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    jurnal?: boolean | JurnalDefaultArgs<ExtArgs>
    teacher?: boolean | TeacherDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["jurnalComment"]>

  export type JurnalCommentSelectScalar = {
    id?: boolean
    comment?: boolean
    jurnalId?: boolean
    teacherId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type JurnalCommentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "comment" | "jurnalId" | "teacherId" | "createdAt" | "updatedAt", ExtArgs["result"]["jurnalComment"]>
  export type JurnalCommentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    jurnal?: boolean | JurnalDefaultArgs<ExtArgs>
    teacher?: boolean | TeacherDefaultArgs<ExtArgs>
  }
  export type JurnalCommentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    jurnal?: boolean | JurnalDefaultArgs<ExtArgs>
    teacher?: boolean | TeacherDefaultArgs<ExtArgs>
  }
  export type JurnalCommentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    jurnal?: boolean | JurnalDefaultArgs<ExtArgs>
    teacher?: boolean | TeacherDefaultArgs<ExtArgs>
  }

  export type $JurnalCommentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "JurnalComment"
    objects: {
      jurnal: Prisma.$JurnalPayload<ExtArgs>
      teacher: Prisma.$TeacherPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      comment: string
      jurnalId: string
      teacherId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["jurnalComment"]>
    composites: {}
  }

  type JurnalCommentGetPayload<S extends boolean | null | undefined | JurnalCommentDefaultArgs> = $Result.GetResult<Prisma.$JurnalCommentPayload, S>

  type JurnalCommentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<JurnalCommentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: JurnalCommentCountAggregateInputType | true
    }

  export interface JurnalCommentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['JurnalComment'], meta: { name: 'JurnalComment' } }
    /**
     * Find zero or one JurnalComment that matches the filter.
     * @param {JurnalCommentFindUniqueArgs} args - Arguments to find a JurnalComment
     * @example
     * // Get one JurnalComment
     * const jurnalComment = await prisma.jurnalComment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends JurnalCommentFindUniqueArgs>(args: SelectSubset<T, JurnalCommentFindUniqueArgs<ExtArgs>>): Prisma__JurnalCommentClient<$Result.GetResult<Prisma.$JurnalCommentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one JurnalComment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {JurnalCommentFindUniqueOrThrowArgs} args - Arguments to find a JurnalComment
     * @example
     * // Get one JurnalComment
     * const jurnalComment = await prisma.jurnalComment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends JurnalCommentFindUniqueOrThrowArgs>(args: SelectSubset<T, JurnalCommentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__JurnalCommentClient<$Result.GetResult<Prisma.$JurnalCommentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first JurnalComment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JurnalCommentFindFirstArgs} args - Arguments to find a JurnalComment
     * @example
     * // Get one JurnalComment
     * const jurnalComment = await prisma.jurnalComment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends JurnalCommentFindFirstArgs>(args?: SelectSubset<T, JurnalCommentFindFirstArgs<ExtArgs>>): Prisma__JurnalCommentClient<$Result.GetResult<Prisma.$JurnalCommentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first JurnalComment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JurnalCommentFindFirstOrThrowArgs} args - Arguments to find a JurnalComment
     * @example
     * // Get one JurnalComment
     * const jurnalComment = await prisma.jurnalComment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends JurnalCommentFindFirstOrThrowArgs>(args?: SelectSubset<T, JurnalCommentFindFirstOrThrowArgs<ExtArgs>>): Prisma__JurnalCommentClient<$Result.GetResult<Prisma.$JurnalCommentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more JurnalComments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JurnalCommentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all JurnalComments
     * const jurnalComments = await prisma.jurnalComment.findMany()
     * 
     * // Get first 10 JurnalComments
     * const jurnalComments = await prisma.jurnalComment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const jurnalCommentWithIdOnly = await prisma.jurnalComment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends JurnalCommentFindManyArgs>(args?: SelectSubset<T, JurnalCommentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JurnalCommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a JurnalComment.
     * @param {JurnalCommentCreateArgs} args - Arguments to create a JurnalComment.
     * @example
     * // Create one JurnalComment
     * const JurnalComment = await prisma.jurnalComment.create({
     *   data: {
     *     // ... data to create a JurnalComment
     *   }
     * })
     * 
     */
    create<T extends JurnalCommentCreateArgs>(args: SelectSubset<T, JurnalCommentCreateArgs<ExtArgs>>): Prisma__JurnalCommentClient<$Result.GetResult<Prisma.$JurnalCommentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many JurnalComments.
     * @param {JurnalCommentCreateManyArgs} args - Arguments to create many JurnalComments.
     * @example
     * // Create many JurnalComments
     * const jurnalComment = await prisma.jurnalComment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends JurnalCommentCreateManyArgs>(args?: SelectSubset<T, JurnalCommentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many JurnalComments and returns the data saved in the database.
     * @param {JurnalCommentCreateManyAndReturnArgs} args - Arguments to create many JurnalComments.
     * @example
     * // Create many JurnalComments
     * const jurnalComment = await prisma.jurnalComment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many JurnalComments and only return the `id`
     * const jurnalCommentWithIdOnly = await prisma.jurnalComment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends JurnalCommentCreateManyAndReturnArgs>(args?: SelectSubset<T, JurnalCommentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JurnalCommentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a JurnalComment.
     * @param {JurnalCommentDeleteArgs} args - Arguments to delete one JurnalComment.
     * @example
     * // Delete one JurnalComment
     * const JurnalComment = await prisma.jurnalComment.delete({
     *   where: {
     *     // ... filter to delete one JurnalComment
     *   }
     * })
     * 
     */
    delete<T extends JurnalCommentDeleteArgs>(args: SelectSubset<T, JurnalCommentDeleteArgs<ExtArgs>>): Prisma__JurnalCommentClient<$Result.GetResult<Prisma.$JurnalCommentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one JurnalComment.
     * @param {JurnalCommentUpdateArgs} args - Arguments to update one JurnalComment.
     * @example
     * // Update one JurnalComment
     * const jurnalComment = await prisma.jurnalComment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends JurnalCommentUpdateArgs>(args: SelectSubset<T, JurnalCommentUpdateArgs<ExtArgs>>): Prisma__JurnalCommentClient<$Result.GetResult<Prisma.$JurnalCommentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more JurnalComments.
     * @param {JurnalCommentDeleteManyArgs} args - Arguments to filter JurnalComments to delete.
     * @example
     * // Delete a few JurnalComments
     * const { count } = await prisma.jurnalComment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends JurnalCommentDeleteManyArgs>(args?: SelectSubset<T, JurnalCommentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more JurnalComments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JurnalCommentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many JurnalComments
     * const jurnalComment = await prisma.jurnalComment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends JurnalCommentUpdateManyArgs>(args: SelectSubset<T, JurnalCommentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more JurnalComments and returns the data updated in the database.
     * @param {JurnalCommentUpdateManyAndReturnArgs} args - Arguments to update many JurnalComments.
     * @example
     * // Update many JurnalComments
     * const jurnalComment = await prisma.jurnalComment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more JurnalComments and only return the `id`
     * const jurnalCommentWithIdOnly = await prisma.jurnalComment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends JurnalCommentUpdateManyAndReturnArgs>(args: SelectSubset<T, JurnalCommentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JurnalCommentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one JurnalComment.
     * @param {JurnalCommentUpsertArgs} args - Arguments to update or create a JurnalComment.
     * @example
     * // Update or create a JurnalComment
     * const jurnalComment = await prisma.jurnalComment.upsert({
     *   create: {
     *     // ... data to create a JurnalComment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the JurnalComment we want to update
     *   }
     * })
     */
    upsert<T extends JurnalCommentUpsertArgs>(args: SelectSubset<T, JurnalCommentUpsertArgs<ExtArgs>>): Prisma__JurnalCommentClient<$Result.GetResult<Prisma.$JurnalCommentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of JurnalComments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JurnalCommentCountArgs} args - Arguments to filter JurnalComments to count.
     * @example
     * // Count the number of JurnalComments
     * const count = await prisma.jurnalComment.count({
     *   where: {
     *     // ... the filter for the JurnalComments we want to count
     *   }
     * })
    **/
    count<T extends JurnalCommentCountArgs>(
      args?: Subset<T, JurnalCommentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], JurnalCommentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a JurnalComment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JurnalCommentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends JurnalCommentAggregateArgs>(args: Subset<T, JurnalCommentAggregateArgs>): Prisma.PrismaPromise<GetJurnalCommentAggregateType<T>>

    /**
     * Group by JurnalComment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JurnalCommentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends JurnalCommentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: JurnalCommentGroupByArgs['orderBy'] }
        : { orderBy?: JurnalCommentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, JurnalCommentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetJurnalCommentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the JurnalComment model
   */
  readonly fields: JurnalCommentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for JurnalComment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__JurnalCommentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    jurnal<T extends JurnalDefaultArgs<ExtArgs> = {}>(args?: Subset<T, JurnalDefaultArgs<ExtArgs>>): Prisma__JurnalClient<$Result.GetResult<Prisma.$JurnalPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    teacher<T extends TeacherDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TeacherDefaultArgs<ExtArgs>>): Prisma__TeacherClient<$Result.GetResult<Prisma.$TeacherPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the JurnalComment model
   */
  interface JurnalCommentFieldRefs {
    readonly id: FieldRef<"JurnalComment", 'String'>
    readonly comment: FieldRef<"JurnalComment", 'String'>
    readonly jurnalId: FieldRef<"JurnalComment", 'String'>
    readonly teacherId: FieldRef<"JurnalComment", 'String'>
    readonly createdAt: FieldRef<"JurnalComment", 'DateTime'>
    readonly updatedAt: FieldRef<"JurnalComment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * JurnalComment findUnique
   */
  export type JurnalCommentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JurnalComment
     */
    select?: JurnalCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JurnalComment
     */
    omit?: JurnalCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JurnalCommentInclude<ExtArgs> | null
    /**
     * Filter, which JurnalComment to fetch.
     */
    where: JurnalCommentWhereUniqueInput
  }

  /**
   * JurnalComment findUniqueOrThrow
   */
  export type JurnalCommentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JurnalComment
     */
    select?: JurnalCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JurnalComment
     */
    omit?: JurnalCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JurnalCommentInclude<ExtArgs> | null
    /**
     * Filter, which JurnalComment to fetch.
     */
    where: JurnalCommentWhereUniqueInput
  }

  /**
   * JurnalComment findFirst
   */
  export type JurnalCommentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JurnalComment
     */
    select?: JurnalCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JurnalComment
     */
    omit?: JurnalCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JurnalCommentInclude<ExtArgs> | null
    /**
     * Filter, which JurnalComment to fetch.
     */
    where?: JurnalCommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JurnalComments to fetch.
     */
    orderBy?: JurnalCommentOrderByWithRelationInput | JurnalCommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for JurnalComments.
     */
    cursor?: JurnalCommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JurnalComments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JurnalComments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of JurnalComments.
     */
    distinct?: JurnalCommentScalarFieldEnum | JurnalCommentScalarFieldEnum[]
  }

  /**
   * JurnalComment findFirstOrThrow
   */
  export type JurnalCommentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JurnalComment
     */
    select?: JurnalCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JurnalComment
     */
    omit?: JurnalCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JurnalCommentInclude<ExtArgs> | null
    /**
     * Filter, which JurnalComment to fetch.
     */
    where?: JurnalCommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JurnalComments to fetch.
     */
    orderBy?: JurnalCommentOrderByWithRelationInput | JurnalCommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for JurnalComments.
     */
    cursor?: JurnalCommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JurnalComments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JurnalComments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of JurnalComments.
     */
    distinct?: JurnalCommentScalarFieldEnum | JurnalCommentScalarFieldEnum[]
  }

  /**
   * JurnalComment findMany
   */
  export type JurnalCommentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JurnalComment
     */
    select?: JurnalCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JurnalComment
     */
    omit?: JurnalCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JurnalCommentInclude<ExtArgs> | null
    /**
     * Filter, which JurnalComments to fetch.
     */
    where?: JurnalCommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JurnalComments to fetch.
     */
    orderBy?: JurnalCommentOrderByWithRelationInput | JurnalCommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing JurnalComments.
     */
    cursor?: JurnalCommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JurnalComments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JurnalComments.
     */
    skip?: number
    distinct?: JurnalCommentScalarFieldEnum | JurnalCommentScalarFieldEnum[]
  }

  /**
   * JurnalComment create
   */
  export type JurnalCommentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JurnalComment
     */
    select?: JurnalCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JurnalComment
     */
    omit?: JurnalCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JurnalCommentInclude<ExtArgs> | null
    /**
     * The data needed to create a JurnalComment.
     */
    data: XOR<JurnalCommentCreateInput, JurnalCommentUncheckedCreateInput>
  }

  /**
   * JurnalComment createMany
   */
  export type JurnalCommentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many JurnalComments.
     */
    data: JurnalCommentCreateManyInput | JurnalCommentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * JurnalComment createManyAndReturn
   */
  export type JurnalCommentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JurnalComment
     */
    select?: JurnalCommentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the JurnalComment
     */
    omit?: JurnalCommentOmit<ExtArgs> | null
    /**
     * The data used to create many JurnalComments.
     */
    data: JurnalCommentCreateManyInput | JurnalCommentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JurnalCommentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * JurnalComment update
   */
  export type JurnalCommentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JurnalComment
     */
    select?: JurnalCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JurnalComment
     */
    omit?: JurnalCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JurnalCommentInclude<ExtArgs> | null
    /**
     * The data needed to update a JurnalComment.
     */
    data: XOR<JurnalCommentUpdateInput, JurnalCommentUncheckedUpdateInput>
    /**
     * Choose, which JurnalComment to update.
     */
    where: JurnalCommentWhereUniqueInput
  }

  /**
   * JurnalComment updateMany
   */
  export type JurnalCommentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update JurnalComments.
     */
    data: XOR<JurnalCommentUpdateManyMutationInput, JurnalCommentUncheckedUpdateManyInput>
    /**
     * Filter which JurnalComments to update
     */
    where?: JurnalCommentWhereInput
    /**
     * Limit how many JurnalComments to update.
     */
    limit?: number
  }

  /**
   * JurnalComment updateManyAndReturn
   */
  export type JurnalCommentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JurnalComment
     */
    select?: JurnalCommentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the JurnalComment
     */
    omit?: JurnalCommentOmit<ExtArgs> | null
    /**
     * The data used to update JurnalComments.
     */
    data: XOR<JurnalCommentUpdateManyMutationInput, JurnalCommentUncheckedUpdateManyInput>
    /**
     * Filter which JurnalComments to update
     */
    where?: JurnalCommentWhereInput
    /**
     * Limit how many JurnalComments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JurnalCommentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * JurnalComment upsert
   */
  export type JurnalCommentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JurnalComment
     */
    select?: JurnalCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JurnalComment
     */
    omit?: JurnalCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JurnalCommentInclude<ExtArgs> | null
    /**
     * The filter to search for the JurnalComment to update in case it exists.
     */
    where: JurnalCommentWhereUniqueInput
    /**
     * In case the JurnalComment found by the `where` argument doesn't exist, create a new JurnalComment with this data.
     */
    create: XOR<JurnalCommentCreateInput, JurnalCommentUncheckedCreateInput>
    /**
     * In case the JurnalComment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<JurnalCommentUpdateInput, JurnalCommentUncheckedUpdateInput>
  }

  /**
   * JurnalComment delete
   */
  export type JurnalCommentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JurnalComment
     */
    select?: JurnalCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JurnalComment
     */
    omit?: JurnalCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JurnalCommentInclude<ExtArgs> | null
    /**
     * Filter which JurnalComment to delete.
     */
    where: JurnalCommentWhereUniqueInput
  }

  /**
   * JurnalComment deleteMany
   */
  export type JurnalCommentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which JurnalComments to delete
     */
    where?: JurnalCommentWhereInput
    /**
     * Limit how many JurnalComments to delete.
     */
    limit?: number
  }

  /**
   * JurnalComment without action
   */
  export type JurnalCommentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JurnalComment
     */
    select?: JurnalCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JurnalComment
     */
    omit?: JurnalCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JurnalCommentInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    username: 'username',
    name: 'name',
    passwordHash: 'passwordHash',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const StudentScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    nisn: 'nisn',
    kelas: 'kelas',
    jurusan: 'jurusan',
    tempatPklId: 'tempatPklId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type StudentScalarFieldEnum = (typeof StudentScalarFieldEnum)[keyof typeof StudentScalarFieldEnum]


  export const TeacherScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    nip: 'nip',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TeacherScalarFieldEnum = (typeof TeacherScalarFieldEnum)[keyof typeof TeacherScalarFieldEnum]


  export const TempatPklScalarFieldEnum: {
    id: 'id',
    nama: 'nama',
    alamat: 'alamat',
    telepon: 'telepon',
    email: 'email',
    namaContact: 'namaContact',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TempatPklScalarFieldEnum = (typeof TempatPklScalarFieldEnum)[keyof typeof TempatPklScalarFieldEnum]


  export const JurnalScalarFieldEnum: {
    id: 'id',
    tanggal: 'tanggal',
    kegiatan: 'kegiatan',
    dokumentasi: 'dokumentasi',
    studentId: 'studentId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type JurnalScalarFieldEnum = (typeof JurnalScalarFieldEnum)[keyof typeof JurnalScalarFieldEnum]


  export const JurnalCommentScalarFieldEnum: {
    id: 'id',
    comment: 'comment',
    jurnalId: 'jurnalId',
    teacherId: 'teacherId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type JurnalCommentScalarFieldEnum = (typeof JurnalCommentScalarFieldEnum)[keyof typeof JurnalCommentScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Role[]'
   */
  export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    student?: XOR<StudentNullableScalarRelationFilter, StudentWhereInput> | null
    teacher?: XOR<TeacherNullableScalarRelationFilter, TeacherWhereInput> | null
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    name?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    student?: StudentOrderByWithRelationInput
    teacher?: TeacherOrderByWithRelationInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    username?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    student?: XOR<StudentNullableScalarRelationFilter, StudentWhereInput> | null
    teacher?: XOR<TeacherNullableScalarRelationFilter, TeacherWhereInput> | null
  }, "id" | "email" | "username">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    name?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    username?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type StudentWhereInput = {
    AND?: StudentWhereInput | StudentWhereInput[]
    OR?: StudentWhereInput[]
    NOT?: StudentWhereInput | StudentWhereInput[]
    id?: StringFilter<"Student"> | string
    userId?: StringFilter<"Student"> | string
    nisn?: StringFilter<"Student"> | string
    kelas?: StringFilter<"Student"> | string
    jurusan?: StringFilter<"Student"> | string
    tempatPklId?: StringNullableFilter<"Student"> | string | null
    createdAt?: DateTimeFilter<"Student"> | Date | string
    updatedAt?: DateTimeFilter<"Student"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    tempatPkl?: XOR<TempatPklNullableScalarRelationFilter, TempatPklWhereInput> | null
    jurnals?: JurnalListRelationFilter
  }

  export type StudentOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    nisn?: SortOrder
    kelas?: SortOrder
    jurusan?: SortOrder
    tempatPklId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    tempatPkl?: TempatPklOrderByWithRelationInput
    jurnals?: JurnalOrderByRelationAggregateInput
  }

  export type StudentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    nisn?: string
    AND?: StudentWhereInput | StudentWhereInput[]
    OR?: StudentWhereInput[]
    NOT?: StudentWhereInput | StudentWhereInput[]
    kelas?: StringFilter<"Student"> | string
    jurusan?: StringFilter<"Student"> | string
    tempatPklId?: StringNullableFilter<"Student"> | string | null
    createdAt?: DateTimeFilter<"Student"> | Date | string
    updatedAt?: DateTimeFilter<"Student"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    tempatPkl?: XOR<TempatPklNullableScalarRelationFilter, TempatPklWhereInput> | null
    jurnals?: JurnalListRelationFilter
  }, "id" | "userId" | "nisn">

  export type StudentOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    nisn?: SortOrder
    kelas?: SortOrder
    jurusan?: SortOrder
    tempatPklId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: StudentCountOrderByAggregateInput
    _max?: StudentMaxOrderByAggregateInput
    _min?: StudentMinOrderByAggregateInput
  }

  export type StudentScalarWhereWithAggregatesInput = {
    AND?: StudentScalarWhereWithAggregatesInput | StudentScalarWhereWithAggregatesInput[]
    OR?: StudentScalarWhereWithAggregatesInput[]
    NOT?: StudentScalarWhereWithAggregatesInput | StudentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Student"> | string
    userId?: StringWithAggregatesFilter<"Student"> | string
    nisn?: StringWithAggregatesFilter<"Student"> | string
    kelas?: StringWithAggregatesFilter<"Student"> | string
    jurusan?: StringWithAggregatesFilter<"Student"> | string
    tempatPklId?: StringNullableWithAggregatesFilter<"Student"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Student"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Student"> | Date | string
  }

  export type TeacherWhereInput = {
    AND?: TeacherWhereInput | TeacherWhereInput[]
    OR?: TeacherWhereInput[]
    NOT?: TeacherWhereInput | TeacherWhereInput[]
    id?: StringFilter<"Teacher"> | string
    userId?: StringFilter<"Teacher"> | string
    nip?: StringFilter<"Teacher"> | string
    createdAt?: DateTimeFilter<"Teacher"> | Date | string
    updatedAt?: DateTimeFilter<"Teacher"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    comments?: JurnalCommentListRelationFilter
  }

  export type TeacherOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    nip?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    comments?: JurnalCommentOrderByRelationAggregateInput
  }

  export type TeacherWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    nip?: string
    AND?: TeacherWhereInput | TeacherWhereInput[]
    OR?: TeacherWhereInput[]
    NOT?: TeacherWhereInput | TeacherWhereInput[]
    createdAt?: DateTimeFilter<"Teacher"> | Date | string
    updatedAt?: DateTimeFilter<"Teacher"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    comments?: JurnalCommentListRelationFilter
  }, "id" | "userId" | "nip">

  export type TeacherOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    nip?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TeacherCountOrderByAggregateInput
    _max?: TeacherMaxOrderByAggregateInput
    _min?: TeacherMinOrderByAggregateInput
  }

  export type TeacherScalarWhereWithAggregatesInput = {
    AND?: TeacherScalarWhereWithAggregatesInput | TeacherScalarWhereWithAggregatesInput[]
    OR?: TeacherScalarWhereWithAggregatesInput[]
    NOT?: TeacherScalarWhereWithAggregatesInput | TeacherScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Teacher"> | string
    userId?: StringWithAggregatesFilter<"Teacher"> | string
    nip?: StringWithAggregatesFilter<"Teacher"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Teacher"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Teacher"> | Date | string
  }

  export type TempatPklWhereInput = {
    AND?: TempatPklWhereInput | TempatPklWhereInput[]
    OR?: TempatPklWhereInput[]
    NOT?: TempatPklWhereInput | TempatPklWhereInput[]
    id?: StringFilter<"TempatPkl"> | string
    nama?: StringFilter<"TempatPkl"> | string
    alamat?: StringFilter<"TempatPkl"> | string
    telepon?: StringNullableFilter<"TempatPkl"> | string | null
    email?: StringNullableFilter<"TempatPkl"> | string | null
    namaContact?: StringNullableFilter<"TempatPkl"> | string | null
    createdAt?: DateTimeFilter<"TempatPkl"> | Date | string
    updatedAt?: DateTimeFilter<"TempatPkl"> | Date | string
    students?: StudentListRelationFilter
  }

  export type TempatPklOrderByWithRelationInput = {
    id?: SortOrder
    nama?: SortOrder
    alamat?: SortOrder
    telepon?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    namaContact?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    students?: StudentOrderByRelationAggregateInput
  }

  export type TempatPklWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TempatPklWhereInput | TempatPklWhereInput[]
    OR?: TempatPklWhereInput[]
    NOT?: TempatPklWhereInput | TempatPklWhereInput[]
    nama?: StringFilter<"TempatPkl"> | string
    alamat?: StringFilter<"TempatPkl"> | string
    telepon?: StringNullableFilter<"TempatPkl"> | string | null
    email?: StringNullableFilter<"TempatPkl"> | string | null
    namaContact?: StringNullableFilter<"TempatPkl"> | string | null
    createdAt?: DateTimeFilter<"TempatPkl"> | Date | string
    updatedAt?: DateTimeFilter<"TempatPkl"> | Date | string
    students?: StudentListRelationFilter
  }, "id">

  export type TempatPklOrderByWithAggregationInput = {
    id?: SortOrder
    nama?: SortOrder
    alamat?: SortOrder
    telepon?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    namaContact?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TempatPklCountOrderByAggregateInput
    _max?: TempatPklMaxOrderByAggregateInput
    _min?: TempatPklMinOrderByAggregateInput
  }

  export type TempatPklScalarWhereWithAggregatesInput = {
    AND?: TempatPklScalarWhereWithAggregatesInput | TempatPklScalarWhereWithAggregatesInput[]
    OR?: TempatPklScalarWhereWithAggregatesInput[]
    NOT?: TempatPklScalarWhereWithAggregatesInput | TempatPklScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TempatPkl"> | string
    nama?: StringWithAggregatesFilter<"TempatPkl"> | string
    alamat?: StringWithAggregatesFilter<"TempatPkl"> | string
    telepon?: StringNullableWithAggregatesFilter<"TempatPkl"> | string | null
    email?: StringNullableWithAggregatesFilter<"TempatPkl"> | string | null
    namaContact?: StringNullableWithAggregatesFilter<"TempatPkl"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"TempatPkl"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TempatPkl"> | Date | string
  }

  export type JurnalWhereInput = {
    AND?: JurnalWhereInput | JurnalWhereInput[]
    OR?: JurnalWhereInput[]
    NOT?: JurnalWhereInput | JurnalWhereInput[]
    id?: StringFilter<"Jurnal"> | string
    tanggal?: DateTimeFilter<"Jurnal"> | Date | string
    kegiatan?: StringFilter<"Jurnal"> | string
    dokumentasi?: StringNullableFilter<"Jurnal"> | string | null
    studentId?: StringFilter<"Jurnal"> | string
    createdAt?: DateTimeFilter<"Jurnal"> | Date | string
    updatedAt?: DateTimeFilter<"Jurnal"> | Date | string
    student?: XOR<StudentScalarRelationFilter, StudentWhereInput>
    comments?: JurnalCommentListRelationFilter
  }

  export type JurnalOrderByWithRelationInput = {
    id?: SortOrder
    tanggal?: SortOrder
    kegiatan?: SortOrder
    dokumentasi?: SortOrderInput | SortOrder
    studentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    student?: StudentOrderByWithRelationInput
    comments?: JurnalCommentOrderByRelationAggregateInput
  }

  export type JurnalWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    studentId_tanggal?: JurnalStudentIdTanggalCompoundUniqueInput
    AND?: JurnalWhereInput | JurnalWhereInput[]
    OR?: JurnalWhereInput[]
    NOT?: JurnalWhereInput | JurnalWhereInput[]
    tanggal?: DateTimeFilter<"Jurnal"> | Date | string
    kegiatan?: StringFilter<"Jurnal"> | string
    dokumentasi?: StringNullableFilter<"Jurnal"> | string | null
    studentId?: StringFilter<"Jurnal"> | string
    createdAt?: DateTimeFilter<"Jurnal"> | Date | string
    updatedAt?: DateTimeFilter<"Jurnal"> | Date | string
    student?: XOR<StudentScalarRelationFilter, StudentWhereInput>
    comments?: JurnalCommentListRelationFilter
  }, "id" | "studentId_tanggal">

  export type JurnalOrderByWithAggregationInput = {
    id?: SortOrder
    tanggal?: SortOrder
    kegiatan?: SortOrder
    dokumentasi?: SortOrderInput | SortOrder
    studentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: JurnalCountOrderByAggregateInput
    _max?: JurnalMaxOrderByAggregateInput
    _min?: JurnalMinOrderByAggregateInput
  }

  export type JurnalScalarWhereWithAggregatesInput = {
    AND?: JurnalScalarWhereWithAggregatesInput | JurnalScalarWhereWithAggregatesInput[]
    OR?: JurnalScalarWhereWithAggregatesInput[]
    NOT?: JurnalScalarWhereWithAggregatesInput | JurnalScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Jurnal"> | string
    tanggal?: DateTimeWithAggregatesFilter<"Jurnal"> | Date | string
    kegiatan?: StringWithAggregatesFilter<"Jurnal"> | string
    dokumentasi?: StringNullableWithAggregatesFilter<"Jurnal"> | string | null
    studentId?: StringWithAggregatesFilter<"Jurnal"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Jurnal"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Jurnal"> | Date | string
  }

  export type JurnalCommentWhereInput = {
    AND?: JurnalCommentWhereInput | JurnalCommentWhereInput[]
    OR?: JurnalCommentWhereInput[]
    NOT?: JurnalCommentWhereInput | JurnalCommentWhereInput[]
    id?: StringFilter<"JurnalComment"> | string
    comment?: StringFilter<"JurnalComment"> | string
    jurnalId?: StringFilter<"JurnalComment"> | string
    teacherId?: StringFilter<"JurnalComment"> | string
    createdAt?: DateTimeFilter<"JurnalComment"> | Date | string
    updatedAt?: DateTimeFilter<"JurnalComment"> | Date | string
    jurnal?: XOR<JurnalScalarRelationFilter, JurnalWhereInput>
    teacher?: XOR<TeacherScalarRelationFilter, TeacherWhereInput>
  }

  export type JurnalCommentOrderByWithRelationInput = {
    id?: SortOrder
    comment?: SortOrder
    jurnalId?: SortOrder
    teacherId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    jurnal?: JurnalOrderByWithRelationInput
    teacher?: TeacherOrderByWithRelationInput
  }

  export type JurnalCommentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: JurnalCommentWhereInput | JurnalCommentWhereInput[]
    OR?: JurnalCommentWhereInput[]
    NOT?: JurnalCommentWhereInput | JurnalCommentWhereInput[]
    comment?: StringFilter<"JurnalComment"> | string
    jurnalId?: StringFilter<"JurnalComment"> | string
    teacherId?: StringFilter<"JurnalComment"> | string
    createdAt?: DateTimeFilter<"JurnalComment"> | Date | string
    updatedAt?: DateTimeFilter<"JurnalComment"> | Date | string
    jurnal?: XOR<JurnalScalarRelationFilter, JurnalWhereInput>
    teacher?: XOR<TeacherScalarRelationFilter, TeacherWhereInput>
  }, "id">

  export type JurnalCommentOrderByWithAggregationInput = {
    id?: SortOrder
    comment?: SortOrder
    jurnalId?: SortOrder
    teacherId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: JurnalCommentCountOrderByAggregateInput
    _max?: JurnalCommentMaxOrderByAggregateInput
    _min?: JurnalCommentMinOrderByAggregateInput
  }

  export type JurnalCommentScalarWhereWithAggregatesInput = {
    AND?: JurnalCommentScalarWhereWithAggregatesInput | JurnalCommentScalarWhereWithAggregatesInput[]
    OR?: JurnalCommentScalarWhereWithAggregatesInput[]
    NOT?: JurnalCommentScalarWhereWithAggregatesInput | JurnalCommentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"JurnalComment"> | string
    comment?: StringWithAggregatesFilter<"JurnalComment"> | string
    jurnalId?: StringWithAggregatesFilter<"JurnalComment"> | string
    teacherId?: StringWithAggregatesFilter<"JurnalComment"> | string
    createdAt?: DateTimeWithAggregatesFilter<"JurnalComment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"JurnalComment"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    username: string
    name: string
    passwordHash: string
    role: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    student?: StudentCreateNestedOneWithoutUserInput
    teacher?: TeacherCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    username: string
    name: string
    passwordHash: string
    role: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    student?: StudentUncheckedCreateNestedOneWithoutUserInput
    teacher?: TeacherUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: StudentUpdateOneWithoutUserNestedInput
    teacher?: TeacherUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: StudentUncheckedUpdateOneWithoutUserNestedInput
    teacher?: TeacherUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    username: string
    name: string
    passwordHash: string
    role: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentCreateInput = {
    id?: string
    nisn: string
    kelas: string
    jurusan: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutStudentInput
    tempatPkl?: TempatPklCreateNestedOneWithoutStudentsInput
    jurnals?: JurnalCreateNestedManyWithoutStudentInput
  }

  export type StudentUncheckedCreateInput = {
    id?: string
    userId: string
    nisn: string
    kelas: string
    jurusan: string
    tempatPklId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    jurnals?: JurnalUncheckedCreateNestedManyWithoutStudentInput
  }

  export type StudentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nisn?: StringFieldUpdateOperationsInput | string
    kelas?: StringFieldUpdateOperationsInput | string
    jurusan?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutStudentNestedInput
    tempatPkl?: TempatPklUpdateOneWithoutStudentsNestedInput
    jurnals?: JurnalUpdateManyWithoutStudentNestedInput
  }

  export type StudentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    nisn?: StringFieldUpdateOperationsInput | string
    kelas?: StringFieldUpdateOperationsInput | string
    jurusan?: StringFieldUpdateOperationsInput | string
    tempatPklId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    jurnals?: JurnalUncheckedUpdateManyWithoutStudentNestedInput
  }

  export type StudentCreateManyInput = {
    id?: string
    userId: string
    nisn: string
    kelas: string
    jurusan: string
    tempatPklId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StudentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nisn?: StringFieldUpdateOperationsInput | string
    kelas?: StringFieldUpdateOperationsInput | string
    jurusan?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    nisn?: StringFieldUpdateOperationsInput | string
    kelas?: StringFieldUpdateOperationsInput | string
    jurusan?: StringFieldUpdateOperationsInput | string
    tempatPklId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeacherCreateInput = {
    id?: string
    nip: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutTeacherInput
    comments?: JurnalCommentCreateNestedManyWithoutTeacherInput
  }

  export type TeacherUncheckedCreateInput = {
    id?: string
    userId: string
    nip: string
    createdAt?: Date | string
    updatedAt?: Date | string
    comments?: JurnalCommentUncheckedCreateNestedManyWithoutTeacherInput
  }

  export type TeacherUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nip?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTeacherNestedInput
    comments?: JurnalCommentUpdateManyWithoutTeacherNestedInput
  }

  export type TeacherUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    nip?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: JurnalCommentUncheckedUpdateManyWithoutTeacherNestedInput
  }

  export type TeacherCreateManyInput = {
    id?: string
    userId: string
    nip: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TeacherUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nip?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeacherUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    nip?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TempatPklCreateInput = {
    id?: string
    nama: string
    alamat: string
    telepon?: string | null
    email?: string | null
    namaContact?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    students?: StudentCreateNestedManyWithoutTempatPklInput
  }

  export type TempatPklUncheckedCreateInput = {
    id?: string
    nama: string
    alamat: string
    telepon?: string | null
    email?: string | null
    namaContact?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    students?: StudentUncheckedCreateNestedManyWithoutTempatPklInput
  }

  export type TempatPklUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nama?: StringFieldUpdateOperationsInput | string
    alamat?: StringFieldUpdateOperationsInput | string
    telepon?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    namaContact?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    students?: StudentUpdateManyWithoutTempatPklNestedInput
  }

  export type TempatPklUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nama?: StringFieldUpdateOperationsInput | string
    alamat?: StringFieldUpdateOperationsInput | string
    telepon?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    namaContact?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    students?: StudentUncheckedUpdateManyWithoutTempatPklNestedInput
  }

  export type TempatPklCreateManyInput = {
    id?: string
    nama: string
    alamat: string
    telepon?: string | null
    email?: string | null
    namaContact?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TempatPklUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nama?: StringFieldUpdateOperationsInput | string
    alamat?: StringFieldUpdateOperationsInput | string
    telepon?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    namaContact?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TempatPklUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    nama?: StringFieldUpdateOperationsInput | string
    alamat?: StringFieldUpdateOperationsInput | string
    telepon?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    namaContact?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JurnalCreateInput = {
    id?: string
    tanggal: Date | string
    kegiatan: string
    dokumentasi?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    student: StudentCreateNestedOneWithoutJurnalsInput
    comments?: JurnalCommentCreateNestedManyWithoutJurnalInput
  }

  export type JurnalUncheckedCreateInput = {
    id?: string
    tanggal: Date | string
    kegiatan: string
    dokumentasi?: string | null
    studentId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    comments?: JurnalCommentUncheckedCreateNestedManyWithoutJurnalInput
  }

  export type JurnalUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tanggal?: DateTimeFieldUpdateOperationsInput | Date | string
    kegiatan?: StringFieldUpdateOperationsInput | string
    dokumentasi?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: StudentUpdateOneRequiredWithoutJurnalsNestedInput
    comments?: JurnalCommentUpdateManyWithoutJurnalNestedInput
  }

  export type JurnalUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tanggal?: DateTimeFieldUpdateOperationsInput | Date | string
    kegiatan?: StringFieldUpdateOperationsInput | string
    dokumentasi?: NullableStringFieldUpdateOperationsInput | string | null
    studentId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: JurnalCommentUncheckedUpdateManyWithoutJurnalNestedInput
  }

  export type JurnalCreateManyInput = {
    id?: string
    tanggal: Date | string
    kegiatan: string
    dokumentasi?: string | null
    studentId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type JurnalUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tanggal?: DateTimeFieldUpdateOperationsInput | Date | string
    kegiatan?: StringFieldUpdateOperationsInput | string
    dokumentasi?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JurnalUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tanggal?: DateTimeFieldUpdateOperationsInput | Date | string
    kegiatan?: StringFieldUpdateOperationsInput | string
    dokumentasi?: NullableStringFieldUpdateOperationsInput | string | null
    studentId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JurnalCommentCreateInput = {
    id?: string
    comment: string
    createdAt?: Date | string
    updatedAt?: Date | string
    jurnal: JurnalCreateNestedOneWithoutCommentsInput
    teacher: TeacherCreateNestedOneWithoutCommentsInput
  }

  export type JurnalCommentUncheckedCreateInput = {
    id?: string
    comment: string
    jurnalId: string
    teacherId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type JurnalCommentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    comment?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    jurnal?: JurnalUpdateOneRequiredWithoutCommentsNestedInput
    teacher?: TeacherUpdateOneRequiredWithoutCommentsNestedInput
  }

  export type JurnalCommentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    comment?: StringFieldUpdateOperationsInput | string
    jurnalId?: StringFieldUpdateOperationsInput | string
    teacherId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JurnalCommentCreateManyInput = {
    id?: string
    comment: string
    jurnalId: string
    teacherId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type JurnalCommentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    comment?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JurnalCommentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    comment?: StringFieldUpdateOperationsInput | string
    jurnalId?: StringFieldUpdateOperationsInput | string
    teacherId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type StudentNullableScalarRelationFilter = {
    is?: StudentWhereInput | null
    isNot?: StudentWhereInput | null
  }

  export type TeacherNullableScalarRelationFilter = {
    is?: TeacherWhereInput | null
    isNot?: TeacherWhereInput | null
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    name?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    name?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    name?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type TempatPklNullableScalarRelationFilter = {
    is?: TempatPklWhereInput | null
    isNot?: TempatPklWhereInput | null
  }

  export type JurnalListRelationFilter = {
    every?: JurnalWhereInput
    some?: JurnalWhereInput
    none?: JurnalWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type JurnalOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StudentCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    nisn?: SortOrder
    kelas?: SortOrder
    jurusan?: SortOrder
    tempatPklId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StudentMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    nisn?: SortOrder
    kelas?: SortOrder
    jurusan?: SortOrder
    tempatPklId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StudentMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    nisn?: SortOrder
    kelas?: SortOrder
    jurusan?: SortOrder
    tempatPklId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type JurnalCommentListRelationFilter = {
    every?: JurnalCommentWhereInput
    some?: JurnalCommentWhereInput
    none?: JurnalCommentWhereInput
  }

  export type JurnalCommentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TeacherCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    nip?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TeacherMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    nip?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TeacherMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    nip?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StudentListRelationFilter = {
    every?: StudentWhereInput
    some?: StudentWhereInput
    none?: StudentWhereInput
  }

  export type StudentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TempatPklCountOrderByAggregateInput = {
    id?: SortOrder
    nama?: SortOrder
    alamat?: SortOrder
    telepon?: SortOrder
    email?: SortOrder
    namaContact?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TempatPklMaxOrderByAggregateInput = {
    id?: SortOrder
    nama?: SortOrder
    alamat?: SortOrder
    telepon?: SortOrder
    email?: SortOrder
    namaContact?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TempatPklMinOrderByAggregateInput = {
    id?: SortOrder
    nama?: SortOrder
    alamat?: SortOrder
    telepon?: SortOrder
    email?: SortOrder
    namaContact?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StudentScalarRelationFilter = {
    is?: StudentWhereInput
    isNot?: StudentWhereInput
  }

  export type JurnalStudentIdTanggalCompoundUniqueInput = {
    studentId: string
    tanggal: Date | string
  }

  export type JurnalCountOrderByAggregateInput = {
    id?: SortOrder
    tanggal?: SortOrder
    kegiatan?: SortOrder
    dokumentasi?: SortOrder
    studentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type JurnalMaxOrderByAggregateInput = {
    id?: SortOrder
    tanggal?: SortOrder
    kegiatan?: SortOrder
    dokumentasi?: SortOrder
    studentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type JurnalMinOrderByAggregateInput = {
    id?: SortOrder
    tanggal?: SortOrder
    kegiatan?: SortOrder
    dokumentasi?: SortOrder
    studentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type JurnalScalarRelationFilter = {
    is?: JurnalWhereInput
    isNot?: JurnalWhereInput
  }

  export type TeacherScalarRelationFilter = {
    is?: TeacherWhereInput
    isNot?: TeacherWhereInput
  }

  export type JurnalCommentCountOrderByAggregateInput = {
    id?: SortOrder
    comment?: SortOrder
    jurnalId?: SortOrder
    teacherId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type JurnalCommentMaxOrderByAggregateInput = {
    id?: SortOrder
    comment?: SortOrder
    jurnalId?: SortOrder
    teacherId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type JurnalCommentMinOrderByAggregateInput = {
    id?: SortOrder
    comment?: SortOrder
    jurnalId?: SortOrder
    teacherId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StudentCreateNestedOneWithoutUserInput = {
    create?: XOR<StudentCreateWithoutUserInput, StudentUncheckedCreateWithoutUserInput>
    connectOrCreate?: StudentCreateOrConnectWithoutUserInput
    connect?: StudentWhereUniqueInput
  }

  export type TeacherCreateNestedOneWithoutUserInput = {
    create?: XOR<TeacherCreateWithoutUserInput, TeacherUncheckedCreateWithoutUserInput>
    connectOrCreate?: TeacherCreateOrConnectWithoutUserInput
    connect?: TeacherWhereUniqueInput
  }

  export type StudentUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<StudentCreateWithoutUserInput, StudentUncheckedCreateWithoutUserInput>
    connectOrCreate?: StudentCreateOrConnectWithoutUserInput
    connect?: StudentWhereUniqueInput
  }

  export type TeacherUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<TeacherCreateWithoutUserInput, TeacherUncheckedCreateWithoutUserInput>
    connectOrCreate?: TeacherCreateOrConnectWithoutUserInput
    connect?: TeacherWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type StudentUpdateOneWithoutUserNestedInput = {
    create?: XOR<StudentCreateWithoutUserInput, StudentUncheckedCreateWithoutUserInput>
    connectOrCreate?: StudentCreateOrConnectWithoutUserInput
    upsert?: StudentUpsertWithoutUserInput
    disconnect?: StudentWhereInput | boolean
    delete?: StudentWhereInput | boolean
    connect?: StudentWhereUniqueInput
    update?: XOR<XOR<StudentUpdateToOneWithWhereWithoutUserInput, StudentUpdateWithoutUserInput>, StudentUncheckedUpdateWithoutUserInput>
  }

  export type TeacherUpdateOneWithoutUserNestedInput = {
    create?: XOR<TeacherCreateWithoutUserInput, TeacherUncheckedCreateWithoutUserInput>
    connectOrCreate?: TeacherCreateOrConnectWithoutUserInput
    upsert?: TeacherUpsertWithoutUserInput
    disconnect?: TeacherWhereInput | boolean
    delete?: TeacherWhereInput | boolean
    connect?: TeacherWhereUniqueInput
    update?: XOR<XOR<TeacherUpdateToOneWithWhereWithoutUserInput, TeacherUpdateWithoutUserInput>, TeacherUncheckedUpdateWithoutUserInput>
  }

  export type StudentUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<StudentCreateWithoutUserInput, StudentUncheckedCreateWithoutUserInput>
    connectOrCreate?: StudentCreateOrConnectWithoutUserInput
    upsert?: StudentUpsertWithoutUserInput
    disconnect?: StudentWhereInput | boolean
    delete?: StudentWhereInput | boolean
    connect?: StudentWhereUniqueInput
    update?: XOR<XOR<StudentUpdateToOneWithWhereWithoutUserInput, StudentUpdateWithoutUserInput>, StudentUncheckedUpdateWithoutUserInput>
  }

  export type TeacherUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<TeacherCreateWithoutUserInput, TeacherUncheckedCreateWithoutUserInput>
    connectOrCreate?: TeacherCreateOrConnectWithoutUserInput
    upsert?: TeacherUpsertWithoutUserInput
    disconnect?: TeacherWhereInput | boolean
    delete?: TeacherWhereInput | boolean
    connect?: TeacherWhereUniqueInput
    update?: XOR<XOR<TeacherUpdateToOneWithWhereWithoutUserInput, TeacherUpdateWithoutUserInput>, TeacherUncheckedUpdateWithoutUserInput>
  }

  export type UserCreateNestedOneWithoutStudentInput = {
    create?: XOR<UserCreateWithoutStudentInput, UserUncheckedCreateWithoutStudentInput>
    connectOrCreate?: UserCreateOrConnectWithoutStudentInput
    connect?: UserWhereUniqueInput
  }

  export type TempatPklCreateNestedOneWithoutStudentsInput = {
    create?: XOR<TempatPklCreateWithoutStudentsInput, TempatPklUncheckedCreateWithoutStudentsInput>
    connectOrCreate?: TempatPklCreateOrConnectWithoutStudentsInput
    connect?: TempatPklWhereUniqueInput
  }

  export type JurnalCreateNestedManyWithoutStudentInput = {
    create?: XOR<JurnalCreateWithoutStudentInput, JurnalUncheckedCreateWithoutStudentInput> | JurnalCreateWithoutStudentInput[] | JurnalUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: JurnalCreateOrConnectWithoutStudentInput | JurnalCreateOrConnectWithoutStudentInput[]
    createMany?: JurnalCreateManyStudentInputEnvelope
    connect?: JurnalWhereUniqueInput | JurnalWhereUniqueInput[]
  }

  export type JurnalUncheckedCreateNestedManyWithoutStudentInput = {
    create?: XOR<JurnalCreateWithoutStudentInput, JurnalUncheckedCreateWithoutStudentInput> | JurnalCreateWithoutStudentInput[] | JurnalUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: JurnalCreateOrConnectWithoutStudentInput | JurnalCreateOrConnectWithoutStudentInput[]
    createMany?: JurnalCreateManyStudentInputEnvelope
    connect?: JurnalWhereUniqueInput | JurnalWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutStudentNestedInput = {
    create?: XOR<UserCreateWithoutStudentInput, UserUncheckedCreateWithoutStudentInput>
    connectOrCreate?: UserCreateOrConnectWithoutStudentInput
    upsert?: UserUpsertWithoutStudentInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutStudentInput, UserUpdateWithoutStudentInput>, UserUncheckedUpdateWithoutStudentInput>
  }

  export type TempatPklUpdateOneWithoutStudentsNestedInput = {
    create?: XOR<TempatPklCreateWithoutStudentsInput, TempatPklUncheckedCreateWithoutStudentsInput>
    connectOrCreate?: TempatPklCreateOrConnectWithoutStudentsInput
    upsert?: TempatPklUpsertWithoutStudentsInput
    disconnect?: TempatPklWhereInput | boolean
    delete?: TempatPklWhereInput | boolean
    connect?: TempatPklWhereUniqueInput
    update?: XOR<XOR<TempatPklUpdateToOneWithWhereWithoutStudentsInput, TempatPklUpdateWithoutStudentsInput>, TempatPklUncheckedUpdateWithoutStudentsInput>
  }

  export type JurnalUpdateManyWithoutStudentNestedInput = {
    create?: XOR<JurnalCreateWithoutStudentInput, JurnalUncheckedCreateWithoutStudentInput> | JurnalCreateWithoutStudentInput[] | JurnalUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: JurnalCreateOrConnectWithoutStudentInput | JurnalCreateOrConnectWithoutStudentInput[]
    upsert?: JurnalUpsertWithWhereUniqueWithoutStudentInput | JurnalUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: JurnalCreateManyStudentInputEnvelope
    set?: JurnalWhereUniqueInput | JurnalWhereUniqueInput[]
    disconnect?: JurnalWhereUniqueInput | JurnalWhereUniqueInput[]
    delete?: JurnalWhereUniqueInput | JurnalWhereUniqueInput[]
    connect?: JurnalWhereUniqueInput | JurnalWhereUniqueInput[]
    update?: JurnalUpdateWithWhereUniqueWithoutStudentInput | JurnalUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: JurnalUpdateManyWithWhereWithoutStudentInput | JurnalUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: JurnalScalarWhereInput | JurnalScalarWhereInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type JurnalUncheckedUpdateManyWithoutStudentNestedInput = {
    create?: XOR<JurnalCreateWithoutStudentInput, JurnalUncheckedCreateWithoutStudentInput> | JurnalCreateWithoutStudentInput[] | JurnalUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: JurnalCreateOrConnectWithoutStudentInput | JurnalCreateOrConnectWithoutStudentInput[]
    upsert?: JurnalUpsertWithWhereUniqueWithoutStudentInput | JurnalUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: JurnalCreateManyStudentInputEnvelope
    set?: JurnalWhereUniqueInput | JurnalWhereUniqueInput[]
    disconnect?: JurnalWhereUniqueInput | JurnalWhereUniqueInput[]
    delete?: JurnalWhereUniqueInput | JurnalWhereUniqueInput[]
    connect?: JurnalWhereUniqueInput | JurnalWhereUniqueInput[]
    update?: JurnalUpdateWithWhereUniqueWithoutStudentInput | JurnalUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: JurnalUpdateManyWithWhereWithoutStudentInput | JurnalUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: JurnalScalarWhereInput | JurnalScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutTeacherInput = {
    create?: XOR<UserCreateWithoutTeacherInput, UserUncheckedCreateWithoutTeacherInput>
    connectOrCreate?: UserCreateOrConnectWithoutTeacherInput
    connect?: UserWhereUniqueInput
  }

  export type JurnalCommentCreateNestedManyWithoutTeacherInput = {
    create?: XOR<JurnalCommentCreateWithoutTeacherInput, JurnalCommentUncheckedCreateWithoutTeacherInput> | JurnalCommentCreateWithoutTeacherInput[] | JurnalCommentUncheckedCreateWithoutTeacherInput[]
    connectOrCreate?: JurnalCommentCreateOrConnectWithoutTeacherInput | JurnalCommentCreateOrConnectWithoutTeacherInput[]
    createMany?: JurnalCommentCreateManyTeacherInputEnvelope
    connect?: JurnalCommentWhereUniqueInput | JurnalCommentWhereUniqueInput[]
  }

  export type JurnalCommentUncheckedCreateNestedManyWithoutTeacherInput = {
    create?: XOR<JurnalCommentCreateWithoutTeacherInput, JurnalCommentUncheckedCreateWithoutTeacherInput> | JurnalCommentCreateWithoutTeacherInput[] | JurnalCommentUncheckedCreateWithoutTeacherInput[]
    connectOrCreate?: JurnalCommentCreateOrConnectWithoutTeacherInput | JurnalCommentCreateOrConnectWithoutTeacherInput[]
    createMany?: JurnalCommentCreateManyTeacherInputEnvelope
    connect?: JurnalCommentWhereUniqueInput | JurnalCommentWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutTeacherNestedInput = {
    create?: XOR<UserCreateWithoutTeacherInput, UserUncheckedCreateWithoutTeacherInput>
    connectOrCreate?: UserCreateOrConnectWithoutTeacherInput
    upsert?: UserUpsertWithoutTeacherInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTeacherInput, UserUpdateWithoutTeacherInput>, UserUncheckedUpdateWithoutTeacherInput>
  }

  export type JurnalCommentUpdateManyWithoutTeacherNestedInput = {
    create?: XOR<JurnalCommentCreateWithoutTeacherInput, JurnalCommentUncheckedCreateWithoutTeacherInput> | JurnalCommentCreateWithoutTeacherInput[] | JurnalCommentUncheckedCreateWithoutTeacherInput[]
    connectOrCreate?: JurnalCommentCreateOrConnectWithoutTeacherInput | JurnalCommentCreateOrConnectWithoutTeacherInput[]
    upsert?: JurnalCommentUpsertWithWhereUniqueWithoutTeacherInput | JurnalCommentUpsertWithWhereUniqueWithoutTeacherInput[]
    createMany?: JurnalCommentCreateManyTeacherInputEnvelope
    set?: JurnalCommentWhereUniqueInput | JurnalCommentWhereUniqueInput[]
    disconnect?: JurnalCommentWhereUniqueInput | JurnalCommentWhereUniqueInput[]
    delete?: JurnalCommentWhereUniqueInput | JurnalCommentWhereUniqueInput[]
    connect?: JurnalCommentWhereUniqueInput | JurnalCommentWhereUniqueInput[]
    update?: JurnalCommentUpdateWithWhereUniqueWithoutTeacherInput | JurnalCommentUpdateWithWhereUniqueWithoutTeacherInput[]
    updateMany?: JurnalCommentUpdateManyWithWhereWithoutTeacherInput | JurnalCommentUpdateManyWithWhereWithoutTeacherInput[]
    deleteMany?: JurnalCommentScalarWhereInput | JurnalCommentScalarWhereInput[]
  }

  export type JurnalCommentUncheckedUpdateManyWithoutTeacherNestedInput = {
    create?: XOR<JurnalCommentCreateWithoutTeacherInput, JurnalCommentUncheckedCreateWithoutTeacherInput> | JurnalCommentCreateWithoutTeacherInput[] | JurnalCommentUncheckedCreateWithoutTeacherInput[]
    connectOrCreate?: JurnalCommentCreateOrConnectWithoutTeacherInput | JurnalCommentCreateOrConnectWithoutTeacherInput[]
    upsert?: JurnalCommentUpsertWithWhereUniqueWithoutTeacherInput | JurnalCommentUpsertWithWhereUniqueWithoutTeacherInput[]
    createMany?: JurnalCommentCreateManyTeacherInputEnvelope
    set?: JurnalCommentWhereUniqueInput | JurnalCommentWhereUniqueInput[]
    disconnect?: JurnalCommentWhereUniqueInput | JurnalCommentWhereUniqueInput[]
    delete?: JurnalCommentWhereUniqueInput | JurnalCommentWhereUniqueInput[]
    connect?: JurnalCommentWhereUniqueInput | JurnalCommentWhereUniqueInput[]
    update?: JurnalCommentUpdateWithWhereUniqueWithoutTeacherInput | JurnalCommentUpdateWithWhereUniqueWithoutTeacherInput[]
    updateMany?: JurnalCommentUpdateManyWithWhereWithoutTeacherInput | JurnalCommentUpdateManyWithWhereWithoutTeacherInput[]
    deleteMany?: JurnalCommentScalarWhereInput | JurnalCommentScalarWhereInput[]
  }

  export type StudentCreateNestedManyWithoutTempatPklInput = {
    create?: XOR<StudentCreateWithoutTempatPklInput, StudentUncheckedCreateWithoutTempatPklInput> | StudentCreateWithoutTempatPklInput[] | StudentUncheckedCreateWithoutTempatPklInput[]
    connectOrCreate?: StudentCreateOrConnectWithoutTempatPklInput | StudentCreateOrConnectWithoutTempatPklInput[]
    createMany?: StudentCreateManyTempatPklInputEnvelope
    connect?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
  }

  export type StudentUncheckedCreateNestedManyWithoutTempatPklInput = {
    create?: XOR<StudentCreateWithoutTempatPklInput, StudentUncheckedCreateWithoutTempatPklInput> | StudentCreateWithoutTempatPklInput[] | StudentUncheckedCreateWithoutTempatPklInput[]
    connectOrCreate?: StudentCreateOrConnectWithoutTempatPklInput | StudentCreateOrConnectWithoutTempatPklInput[]
    createMany?: StudentCreateManyTempatPklInputEnvelope
    connect?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
  }

  export type StudentUpdateManyWithoutTempatPklNestedInput = {
    create?: XOR<StudentCreateWithoutTempatPklInput, StudentUncheckedCreateWithoutTempatPklInput> | StudentCreateWithoutTempatPklInput[] | StudentUncheckedCreateWithoutTempatPklInput[]
    connectOrCreate?: StudentCreateOrConnectWithoutTempatPklInput | StudentCreateOrConnectWithoutTempatPklInput[]
    upsert?: StudentUpsertWithWhereUniqueWithoutTempatPklInput | StudentUpsertWithWhereUniqueWithoutTempatPklInput[]
    createMany?: StudentCreateManyTempatPklInputEnvelope
    set?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    disconnect?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    delete?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    connect?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    update?: StudentUpdateWithWhereUniqueWithoutTempatPklInput | StudentUpdateWithWhereUniqueWithoutTempatPklInput[]
    updateMany?: StudentUpdateManyWithWhereWithoutTempatPklInput | StudentUpdateManyWithWhereWithoutTempatPklInput[]
    deleteMany?: StudentScalarWhereInput | StudentScalarWhereInput[]
  }

  export type StudentUncheckedUpdateManyWithoutTempatPklNestedInput = {
    create?: XOR<StudentCreateWithoutTempatPklInput, StudentUncheckedCreateWithoutTempatPklInput> | StudentCreateWithoutTempatPklInput[] | StudentUncheckedCreateWithoutTempatPklInput[]
    connectOrCreate?: StudentCreateOrConnectWithoutTempatPklInput | StudentCreateOrConnectWithoutTempatPklInput[]
    upsert?: StudentUpsertWithWhereUniqueWithoutTempatPklInput | StudentUpsertWithWhereUniqueWithoutTempatPklInput[]
    createMany?: StudentCreateManyTempatPklInputEnvelope
    set?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    disconnect?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    delete?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    connect?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    update?: StudentUpdateWithWhereUniqueWithoutTempatPklInput | StudentUpdateWithWhereUniqueWithoutTempatPklInput[]
    updateMany?: StudentUpdateManyWithWhereWithoutTempatPklInput | StudentUpdateManyWithWhereWithoutTempatPklInput[]
    deleteMany?: StudentScalarWhereInput | StudentScalarWhereInput[]
  }

  export type StudentCreateNestedOneWithoutJurnalsInput = {
    create?: XOR<StudentCreateWithoutJurnalsInput, StudentUncheckedCreateWithoutJurnalsInput>
    connectOrCreate?: StudentCreateOrConnectWithoutJurnalsInput
    connect?: StudentWhereUniqueInput
  }

  export type JurnalCommentCreateNestedManyWithoutJurnalInput = {
    create?: XOR<JurnalCommentCreateWithoutJurnalInput, JurnalCommentUncheckedCreateWithoutJurnalInput> | JurnalCommentCreateWithoutJurnalInput[] | JurnalCommentUncheckedCreateWithoutJurnalInput[]
    connectOrCreate?: JurnalCommentCreateOrConnectWithoutJurnalInput | JurnalCommentCreateOrConnectWithoutJurnalInput[]
    createMany?: JurnalCommentCreateManyJurnalInputEnvelope
    connect?: JurnalCommentWhereUniqueInput | JurnalCommentWhereUniqueInput[]
  }

  export type JurnalCommentUncheckedCreateNestedManyWithoutJurnalInput = {
    create?: XOR<JurnalCommentCreateWithoutJurnalInput, JurnalCommentUncheckedCreateWithoutJurnalInput> | JurnalCommentCreateWithoutJurnalInput[] | JurnalCommentUncheckedCreateWithoutJurnalInput[]
    connectOrCreate?: JurnalCommentCreateOrConnectWithoutJurnalInput | JurnalCommentCreateOrConnectWithoutJurnalInput[]
    createMany?: JurnalCommentCreateManyJurnalInputEnvelope
    connect?: JurnalCommentWhereUniqueInput | JurnalCommentWhereUniqueInput[]
  }

  export type StudentUpdateOneRequiredWithoutJurnalsNestedInput = {
    create?: XOR<StudentCreateWithoutJurnalsInput, StudentUncheckedCreateWithoutJurnalsInput>
    connectOrCreate?: StudentCreateOrConnectWithoutJurnalsInput
    upsert?: StudentUpsertWithoutJurnalsInput
    connect?: StudentWhereUniqueInput
    update?: XOR<XOR<StudentUpdateToOneWithWhereWithoutJurnalsInput, StudentUpdateWithoutJurnalsInput>, StudentUncheckedUpdateWithoutJurnalsInput>
  }

  export type JurnalCommentUpdateManyWithoutJurnalNestedInput = {
    create?: XOR<JurnalCommentCreateWithoutJurnalInput, JurnalCommentUncheckedCreateWithoutJurnalInput> | JurnalCommentCreateWithoutJurnalInput[] | JurnalCommentUncheckedCreateWithoutJurnalInput[]
    connectOrCreate?: JurnalCommentCreateOrConnectWithoutJurnalInput | JurnalCommentCreateOrConnectWithoutJurnalInput[]
    upsert?: JurnalCommentUpsertWithWhereUniqueWithoutJurnalInput | JurnalCommentUpsertWithWhereUniqueWithoutJurnalInput[]
    createMany?: JurnalCommentCreateManyJurnalInputEnvelope
    set?: JurnalCommentWhereUniqueInput | JurnalCommentWhereUniqueInput[]
    disconnect?: JurnalCommentWhereUniqueInput | JurnalCommentWhereUniqueInput[]
    delete?: JurnalCommentWhereUniqueInput | JurnalCommentWhereUniqueInput[]
    connect?: JurnalCommentWhereUniqueInput | JurnalCommentWhereUniqueInput[]
    update?: JurnalCommentUpdateWithWhereUniqueWithoutJurnalInput | JurnalCommentUpdateWithWhereUniqueWithoutJurnalInput[]
    updateMany?: JurnalCommentUpdateManyWithWhereWithoutJurnalInput | JurnalCommentUpdateManyWithWhereWithoutJurnalInput[]
    deleteMany?: JurnalCommentScalarWhereInput | JurnalCommentScalarWhereInput[]
  }

  export type JurnalCommentUncheckedUpdateManyWithoutJurnalNestedInput = {
    create?: XOR<JurnalCommentCreateWithoutJurnalInput, JurnalCommentUncheckedCreateWithoutJurnalInput> | JurnalCommentCreateWithoutJurnalInput[] | JurnalCommentUncheckedCreateWithoutJurnalInput[]
    connectOrCreate?: JurnalCommentCreateOrConnectWithoutJurnalInput | JurnalCommentCreateOrConnectWithoutJurnalInput[]
    upsert?: JurnalCommentUpsertWithWhereUniqueWithoutJurnalInput | JurnalCommentUpsertWithWhereUniqueWithoutJurnalInput[]
    createMany?: JurnalCommentCreateManyJurnalInputEnvelope
    set?: JurnalCommentWhereUniqueInput | JurnalCommentWhereUniqueInput[]
    disconnect?: JurnalCommentWhereUniqueInput | JurnalCommentWhereUniqueInput[]
    delete?: JurnalCommentWhereUniqueInput | JurnalCommentWhereUniqueInput[]
    connect?: JurnalCommentWhereUniqueInput | JurnalCommentWhereUniqueInput[]
    update?: JurnalCommentUpdateWithWhereUniqueWithoutJurnalInput | JurnalCommentUpdateWithWhereUniqueWithoutJurnalInput[]
    updateMany?: JurnalCommentUpdateManyWithWhereWithoutJurnalInput | JurnalCommentUpdateManyWithWhereWithoutJurnalInput[]
    deleteMany?: JurnalCommentScalarWhereInput | JurnalCommentScalarWhereInput[]
  }

  export type JurnalCreateNestedOneWithoutCommentsInput = {
    create?: XOR<JurnalCreateWithoutCommentsInput, JurnalUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: JurnalCreateOrConnectWithoutCommentsInput
    connect?: JurnalWhereUniqueInput
  }

  export type TeacherCreateNestedOneWithoutCommentsInput = {
    create?: XOR<TeacherCreateWithoutCommentsInput, TeacherUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: TeacherCreateOrConnectWithoutCommentsInput
    connect?: TeacherWhereUniqueInput
  }

  export type JurnalUpdateOneRequiredWithoutCommentsNestedInput = {
    create?: XOR<JurnalCreateWithoutCommentsInput, JurnalUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: JurnalCreateOrConnectWithoutCommentsInput
    upsert?: JurnalUpsertWithoutCommentsInput
    connect?: JurnalWhereUniqueInput
    update?: XOR<XOR<JurnalUpdateToOneWithWhereWithoutCommentsInput, JurnalUpdateWithoutCommentsInput>, JurnalUncheckedUpdateWithoutCommentsInput>
  }

  export type TeacherUpdateOneRequiredWithoutCommentsNestedInput = {
    create?: XOR<TeacherCreateWithoutCommentsInput, TeacherUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: TeacherCreateOrConnectWithoutCommentsInput
    upsert?: TeacherUpsertWithoutCommentsInput
    connect?: TeacherWhereUniqueInput
    update?: XOR<XOR<TeacherUpdateToOneWithWhereWithoutCommentsInput, TeacherUpdateWithoutCommentsInput>, TeacherUncheckedUpdateWithoutCommentsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type StudentCreateWithoutUserInput = {
    id?: string
    nisn: string
    kelas: string
    jurusan: string
    createdAt?: Date | string
    updatedAt?: Date | string
    tempatPkl?: TempatPklCreateNestedOneWithoutStudentsInput
    jurnals?: JurnalCreateNestedManyWithoutStudentInput
  }

  export type StudentUncheckedCreateWithoutUserInput = {
    id?: string
    nisn: string
    kelas: string
    jurusan: string
    tempatPklId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    jurnals?: JurnalUncheckedCreateNestedManyWithoutStudentInput
  }

  export type StudentCreateOrConnectWithoutUserInput = {
    where: StudentWhereUniqueInput
    create: XOR<StudentCreateWithoutUserInput, StudentUncheckedCreateWithoutUserInput>
  }

  export type TeacherCreateWithoutUserInput = {
    id?: string
    nip: string
    createdAt?: Date | string
    updatedAt?: Date | string
    comments?: JurnalCommentCreateNestedManyWithoutTeacherInput
  }

  export type TeacherUncheckedCreateWithoutUserInput = {
    id?: string
    nip: string
    createdAt?: Date | string
    updatedAt?: Date | string
    comments?: JurnalCommentUncheckedCreateNestedManyWithoutTeacherInput
  }

  export type TeacherCreateOrConnectWithoutUserInput = {
    where: TeacherWhereUniqueInput
    create: XOR<TeacherCreateWithoutUserInput, TeacherUncheckedCreateWithoutUserInput>
  }

  export type StudentUpsertWithoutUserInput = {
    update: XOR<StudentUpdateWithoutUserInput, StudentUncheckedUpdateWithoutUserInput>
    create: XOR<StudentCreateWithoutUserInput, StudentUncheckedCreateWithoutUserInput>
    where?: StudentWhereInput
  }

  export type StudentUpdateToOneWithWhereWithoutUserInput = {
    where?: StudentWhereInput
    data: XOR<StudentUpdateWithoutUserInput, StudentUncheckedUpdateWithoutUserInput>
  }

  export type StudentUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    nisn?: StringFieldUpdateOperationsInput | string
    kelas?: StringFieldUpdateOperationsInput | string
    jurusan?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tempatPkl?: TempatPklUpdateOneWithoutStudentsNestedInput
    jurnals?: JurnalUpdateManyWithoutStudentNestedInput
  }

  export type StudentUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    nisn?: StringFieldUpdateOperationsInput | string
    kelas?: StringFieldUpdateOperationsInput | string
    jurusan?: StringFieldUpdateOperationsInput | string
    tempatPklId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    jurnals?: JurnalUncheckedUpdateManyWithoutStudentNestedInput
  }

  export type TeacherUpsertWithoutUserInput = {
    update: XOR<TeacherUpdateWithoutUserInput, TeacherUncheckedUpdateWithoutUserInput>
    create: XOR<TeacherCreateWithoutUserInput, TeacherUncheckedCreateWithoutUserInput>
    where?: TeacherWhereInput
  }

  export type TeacherUpdateToOneWithWhereWithoutUserInput = {
    where?: TeacherWhereInput
    data: XOR<TeacherUpdateWithoutUserInput, TeacherUncheckedUpdateWithoutUserInput>
  }

  export type TeacherUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    nip?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: JurnalCommentUpdateManyWithoutTeacherNestedInput
  }

  export type TeacherUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    nip?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: JurnalCommentUncheckedUpdateManyWithoutTeacherNestedInput
  }

  export type UserCreateWithoutStudentInput = {
    id?: string
    email: string
    username: string
    name: string
    passwordHash: string
    role: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    teacher?: TeacherCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutStudentInput = {
    id?: string
    email: string
    username: string
    name: string
    passwordHash: string
    role: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    teacher?: TeacherUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutStudentInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutStudentInput, UserUncheckedCreateWithoutStudentInput>
  }

  export type TempatPklCreateWithoutStudentsInput = {
    id?: string
    nama: string
    alamat: string
    telepon?: string | null
    email?: string | null
    namaContact?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TempatPklUncheckedCreateWithoutStudentsInput = {
    id?: string
    nama: string
    alamat: string
    telepon?: string | null
    email?: string | null
    namaContact?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TempatPklCreateOrConnectWithoutStudentsInput = {
    where: TempatPklWhereUniqueInput
    create: XOR<TempatPklCreateWithoutStudentsInput, TempatPklUncheckedCreateWithoutStudentsInput>
  }

  export type JurnalCreateWithoutStudentInput = {
    id?: string
    tanggal: Date | string
    kegiatan: string
    dokumentasi?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    comments?: JurnalCommentCreateNestedManyWithoutJurnalInput
  }

  export type JurnalUncheckedCreateWithoutStudentInput = {
    id?: string
    tanggal: Date | string
    kegiatan: string
    dokumentasi?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    comments?: JurnalCommentUncheckedCreateNestedManyWithoutJurnalInput
  }

  export type JurnalCreateOrConnectWithoutStudentInput = {
    where: JurnalWhereUniqueInput
    create: XOR<JurnalCreateWithoutStudentInput, JurnalUncheckedCreateWithoutStudentInput>
  }

  export type JurnalCreateManyStudentInputEnvelope = {
    data: JurnalCreateManyStudentInput | JurnalCreateManyStudentInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutStudentInput = {
    update: XOR<UserUpdateWithoutStudentInput, UserUncheckedUpdateWithoutStudentInput>
    create: XOR<UserCreateWithoutStudentInput, UserUncheckedCreateWithoutStudentInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutStudentInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutStudentInput, UserUncheckedUpdateWithoutStudentInput>
  }

  export type UserUpdateWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    teacher?: TeacherUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    teacher?: TeacherUncheckedUpdateOneWithoutUserNestedInput
  }

  export type TempatPklUpsertWithoutStudentsInput = {
    update: XOR<TempatPklUpdateWithoutStudentsInput, TempatPklUncheckedUpdateWithoutStudentsInput>
    create: XOR<TempatPklCreateWithoutStudentsInput, TempatPklUncheckedCreateWithoutStudentsInput>
    where?: TempatPklWhereInput
  }

  export type TempatPklUpdateToOneWithWhereWithoutStudentsInput = {
    where?: TempatPklWhereInput
    data: XOR<TempatPklUpdateWithoutStudentsInput, TempatPklUncheckedUpdateWithoutStudentsInput>
  }

  export type TempatPklUpdateWithoutStudentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    nama?: StringFieldUpdateOperationsInput | string
    alamat?: StringFieldUpdateOperationsInput | string
    telepon?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    namaContact?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TempatPklUncheckedUpdateWithoutStudentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    nama?: StringFieldUpdateOperationsInput | string
    alamat?: StringFieldUpdateOperationsInput | string
    telepon?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    namaContact?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JurnalUpsertWithWhereUniqueWithoutStudentInput = {
    where: JurnalWhereUniqueInput
    update: XOR<JurnalUpdateWithoutStudentInput, JurnalUncheckedUpdateWithoutStudentInput>
    create: XOR<JurnalCreateWithoutStudentInput, JurnalUncheckedCreateWithoutStudentInput>
  }

  export type JurnalUpdateWithWhereUniqueWithoutStudentInput = {
    where: JurnalWhereUniqueInput
    data: XOR<JurnalUpdateWithoutStudentInput, JurnalUncheckedUpdateWithoutStudentInput>
  }

  export type JurnalUpdateManyWithWhereWithoutStudentInput = {
    where: JurnalScalarWhereInput
    data: XOR<JurnalUpdateManyMutationInput, JurnalUncheckedUpdateManyWithoutStudentInput>
  }

  export type JurnalScalarWhereInput = {
    AND?: JurnalScalarWhereInput | JurnalScalarWhereInput[]
    OR?: JurnalScalarWhereInput[]
    NOT?: JurnalScalarWhereInput | JurnalScalarWhereInput[]
    id?: StringFilter<"Jurnal"> | string
    tanggal?: DateTimeFilter<"Jurnal"> | Date | string
    kegiatan?: StringFilter<"Jurnal"> | string
    dokumentasi?: StringNullableFilter<"Jurnal"> | string | null
    studentId?: StringFilter<"Jurnal"> | string
    createdAt?: DateTimeFilter<"Jurnal"> | Date | string
    updatedAt?: DateTimeFilter<"Jurnal"> | Date | string
  }

  export type UserCreateWithoutTeacherInput = {
    id?: string
    email: string
    username: string
    name: string
    passwordHash: string
    role: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    student?: StudentCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTeacherInput = {
    id?: string
    email: string
    username: string
    name: string
    passwordHash: string
    role: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    student?: StudentUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTeacherInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTeacherInput, UserUncheckedCreateWithoutTeacherInput>
  }

  export type JurnalCommentCreateWithoutTeacherInput = {
    id?: string
    comment: string
    createdAt?: Date | string
    updatedAt?: Date | string
    jurnal: JurnalCreateNestedOneWithoutCommentsInput
  }

  export type JurnalCommentUncheckedCreateWithoutTeacherInput = {
    id?: string
    comment: string
    jurnalId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type JurnalCommentCreateOrConnectWithoutTeacherInput = {
    where: JurnalCommentWhereUniqueInput
    create: XOR<JurnalCommentCreateWithoutTeacherInput, JurnalCommentUncheckedCreateWithoutTeacherInput>
  }

  export type JurnalCommentCreateManyTeacherInputEnvelope = {
    data: JurnalCommentCreateManyTeacherInput | JurnalCommentCreateManyTeacherInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutTeacherInput = {
    update: XOR<UserUpdateWithoutTeacherInput, UserUncheckedUpdateWithoutTeacherInput>
    create: XOR<UserCreateWithoutTeacherInput, UserUncheckedCreateWithoutTeacherInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTeacherInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTeacherInput, UserUncheckedUpdateWithoutTeacherInput>
  }

  export type UserUpdateWithoutTeacherInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: StudentUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTeacherInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: StudentUncheckedUpdateOneWithoutUserNestedInput
  }

  export type JurnalCommentUpsertWithWhereUniqueWithoutTeacherInput = {
    where: JurnalCommentWhereUniqueInput
    update: XOR<JurnalCommentUpdateWithoutTeacherInput, JurnalCommentUncheckedUpdateWithoutTeacherInput>
    create: XOR<JurnalCommentCreateWithoutTeacherInput, JurnalCommentUncheckedCreateWithoutTeacherInput>
  }

  export type JurnalCommentUpdateWithWhereUniqueWithoutTeacherInput = {
    where: JurnalCommentWhereUniqueInput
    data: XOR<JurnalCommentUpdateWithoutTeacherInput, JurnalCommentUncheckedUpdateWithoutTeacherInput>
  }

  export type JurnalCommentUpdateManyWithWhereWithoutTeacherInput = {
    where: JurnalCommentScalarWhereInput
    data: XOR<JurnalCommentUpdateManyMutationInput, JurnalCommentUncheckedUpdateManyWithoutTeacherInput>
  }

  export type JurnalCommentScalarWhereInput = {
    AND?: JurnalCommentScalarWhereInput | JurnalCommentScalarWhereInput[]
    OR?: JurnalCommentScalarWhereInput[]
    NOT?: JurnalCommentScalarWhereInput | JurnalCommentScalarWhereInput[]
    id?: StringFilter<"JurnalComment"> | string
    comment?: StringFilter<"JurnalComment"> | string
    jurnalId?: StringFilter<"JurnalComment"> | string
    teacherId?: StringFilter<"JurnalComment"> | string
    createdAt?: DateTimeFilter<"JurnalComment"> | Date | string
    updatedAt?: DateTimeFilter<"JurnalComment"> | Date | string
  }

  export type StudentCreateWithoutTempatPklInput = {
    id?: string
    nisn: string
    kelas: string
    jurusan: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutStudentInput
    jurnals?: JurnalCreateNestedManyWithoutStudentInput
  }

  export type StudentUncheckedCreateWithoutTempatPklInput = {
    id?: string
    userId: string
    nisn: string
    kelas: string
    jurusan: string
    createdAt?: Date | string
    updatedAt?: Date | string
    jurnals?: JurnalUncheckedCreateNestedManyWithoutStudentInput
  }

  export type StudentCreateOrConnectWithoutTempatPklInput = {
    where: StudentWhereUniqueInput
    create: XOR<StudentCreateWithoutTempatPklInput, StudentUncheckedCreateWithoutTempatPklInput>
  }

  export type StudentCreateManyTempatPklInputEnvelope = {
    data: StudentCreateManyTempatPklInput | StudentCreateManyTempatPklInput[]
    skipDuplicates?: boolean
  }

  export type StudentUpsertWithWhereUniqueWithoutTempatPklInput = {
    where: StudentWhereUniqueInput
    update: XOR<StudentUpdateWithoutTempatPklInput, StudentUncheckedUpdateWithoutTempatPklInput>
    create: XOR<StudentCreateWithoutTempatPklInput, StudentUncheckedCreateWithoutTempatPklInput>
  }

  export type StudentUpdateWithWhereUniqueWithoutTempatPklInput = {
    where: StudentWhereUniqueInput
    data: XOR<StudentUpdateWithoutTempatPklInput, StudentUncheckedUpdateWithoutTempatPklInput>
  }

  export type StudentUpdateManyWithWhereWithoutTempatPklInput = {
    where: StudentScalarWhereInput
    data: XOR<StudentUpdateManyMutationInput, StudentUncheckedUpdateManyWithoutTempatPklInput>
  }

  export type StudentScalarWhereInput = {
    AND?: StudentScalarWhereInput | StudentScalarWhereInput[]
    OR?: StudentScalarWhereInput[]
    NOT?: StudentScalarWhereInput | StudentScalarWhereInput[]
    id?: StringFilter<"Student"> | string
    userId?: StringFilter<"Student"> | string
    nisn?: StringFilter<"Student"> | string
    kelas?: StringFilter<"Student"> | string
    jurusan?: StringFilter<"Student"> | string
    tempatPklId?: StringNullableFilter<"Student"> | string | null
    createdAt?: DateTimeFilter<"Student"> | Date | string
    updatedAt?: DateTimeFilter<"Student"> | Date | string
  }

  export type StudentCreateWithoutJurnalsInput = {
    id?: string
    nisn: string
    kelas: string
    jurusan: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutStudentInput
    tempatPkl?: TempatPklCreateNestedOneWithoutStudentsInput
  }

  export type StudentUncheckedCreateWithoutJurnalsInput = {
    id?: string
    userId: string
    nisn: string
    kelas: string
    jurusan: string
    tempatPklId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StudentCreateOrConnectWithoutJurnalsInput = {
    where: StudentWhereUniqueInput
    create: XOR<StudentCreateWithoutJurnalsInput, StudentUncheckedCreateWithoutJurnalsInput>
  }

  export type JurnalCommentCreateWithoutJurnalInput = {
    id?: string
    comment: string
    createdAt?: Date | string
    updatedAt?: Date | string
    teacher: TeacherCreateNestedOneWithoutCommentsInput
  }

  export type JurnalCommentUncheckedCreateWithoutJurnalInput = {
    id?: string
    comment: string
    teacherId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type JurnalCommentCreateOrConnectWithoutJurnalInput = {
    where: JurnalCommentWhereUniqueInput
    create: XOR<JurnalCommentCreateWithoutJurnalInput, JurnalCommentUncheckedCreateWithoutJurnalInput>
  }

  export type JurnalCommentCreateManyJurnalInputEnvelope = {
    data: JurnalCommentCreateManyJurnalInput | JurnalCommentCreateManyJurnalInput[]
    skipDuplicates?: boolean
  }

  export type StudentUpsertWithoutJurnalsInput = {
    update: XOR<StudentUpdateWithoutJurnalsInput, StudentUncheckedUpdateWithoutJurnalsInput>
    create: XOR<StudentCreateWithoutJurnalsInput, StudentUncheckedCreateWithoutJurnalsInput>
    where?: StudentWhereInput
  }

  export type StudentUpdateToOneWithWhereWithoutJurnalsInput = {
    where?: StudentWhereInput
    data: XOR<StudentUpdateWithoutJurnalsInput, StudentUncheckedUpdateWithoutJurnalsInput>
  }

  export type StudentUpdateWithoutJurnalsInput = {
    id?: StringFieldUpdateOperationsInput | string
    nisn?: StringFieldUpdateOperationsInput | string
    kelas?: StringFieldUpdateOperationsInput | string
    jurusan?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutStudentNestedInput
    tempatPkl?: TempatPklUpdateOneWithoutStudentsNestedInput
  }

  export type StudentUncheckedUpdateWithoutJurnalsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    nisn?: StringFieldUpdateOperationsInput | string
    kelas?: StringFieldUpdateOperationsInput | string
    jurusan?: StringFieldUpdateOperationsInput | string
    tempatPklId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JurnalCommentUpsertWithWhereUniqueWithoutJurnalInput = {
    where: JurnalCommentWhereUniqueInput
    update: XOR<JurnalCommentUpdateWithoutJurnalInput, JurnalCommentUncheckedUpdateWithoutJurnalInput>
    create: XOR<JurnalCommentCreateWithoutJurnalInput, JurnalCommentUncheckedCreateWithoutJurnalInput>
  }

  export type JurnalCommentUpdateWithWhereUniqueWithoutJurnalInput = {
    where: JurnalCommentWhereUniqueInput
    data: XOR<JurnalCommentUpdateWithoutJurnalInput, JurnalCommentUncheckedUpdateWithoutJurnalInput>
  }

  export type JurnalCommentUpdateManyWithWhereWithoutJurnalInput = {
    where: JurnalCommentScalarWhereInput
    data: XOR<JurnalCommentUpdateManyMutationInput, JurnalCommentUncheckedUpdateManyWithoutJurnalInput>
  }

  export type JurnalCreateWithoutCommentsInput = {
    id?: string
    tanggal: Date | string
    kegiatan: string
    dokumentasi?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    student: StudentCreateNestedOneWithoutJurnalsInput
  }

  export type JurnalUncheckedCreateWithoutCommentsInput = {
    id?: string
    tanggal: Date | string
    kegiatan: string
    dokumentasi?: string | null
    studentId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type JurnalCreateOrConnectWithoutCommentsInput = {
    where: JurnalWhereUniqueInput
    create: XOR<JurnalCreateWithoutCommentsInput, JurnalUncheckedCreateWithoutCommentsInput>
  }

  export type TeacherCreateWithoutCommentsInput = {
    id?: string
    nip: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutTeacherInput
  }

  export type TeacherUncheckedCreateWithoutCommentsInput = {
    id?: string
    userId: string
    nip: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TeacherCreateOrConnectWithoutCommentsInput = {
    where: TeacherWhereUniqueInput
    create: XOR<TeacherCreateWithoutCommentsInput, TeacherUncheckedCreateWithoutCommentsInput>
  }

  export type JurnalUpsertWithoutCommentsInput = {
    update: XOR<JurnalUpdateWithoutCommentsInput, JurnalUncheckedUpdateWithoutCommentsInput>
    create: XOR<JurnalCreateWithoutCommentsInput, JurnalUncheckedCreateWithoutCommentsInput>
    where?: JurnalWhereInput
  }

  export type JurnalUpdateToOneWithWhereWithoutCommentsInput = {
    where?: JurnalWhereInput
    data: XOR<JurnalUpdateWithoutCommentsInput, JurnalUncheckedUpdateWithoutCommentsInput>
  }

  export type JurnalUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tanggal?: DateTimeFieldUpdateOperationsInput | Date | string
    kegiatan?: StringFieldUpdateOperationsInput | string
    dokumentasi?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: StudentUpdateOneRequiredWithoutJurnalsNestedInput
  }

  export type JurnalUncheckedUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tanggal?: DateTimeFieldUpdateOperationsInput | Date | string
    kegiatan?: StringFieldUpdateOperationsInput | string
    dokumentasi?: NullableStringFieldUpdateOperationsInput | string | null
    studentId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeacherUpsertWithoutCommentsInput = {
    update: XOR<TeacherUpdateWithoutCommentsInput, TeacherUncheckedUpdateWithoutCommentsInput>
    create: XOR<TeacherCreateWithoutCommentsInput, TeacherUncheckedCreateWithoutCommentsInput>
    where?: TeacherWhereInput
  }

  export type TeacherUpdateToOneWithWhereWithoutCommentsInput = {
    where?: TeacherWhereInput
    data: XOR<TeacherUpdateWithoutCommentsInput, TeacherUncheckedUpdateWithoutCommentsInput>
  }

  export type TeacherUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    nip?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTeacherNestedInput
  }

  export type TeacherUncheckedUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    nip?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JurnalCreateManyStudentInput = {
    id?: string
    tanggal: Date | string
    kegiatan: string
    dokumentasi?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type JurnalUpdateWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    tanggal?: DateTimeFieldUpdateOperationsInput | Date | string
    kegiatan?: StringFieldUpdateOperationsInput | string
    dokumentasi?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: JurnalCommentUpdateManyWithoutJurnalNestedInput
  }

  export type JurnalUncheckedUpdateWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    tanggal?: DateTimeFieldUpdateOperationsInput | Date | string
    kegiatan?: StringFieldUpdateOperationsInput | string
    dokumentasi?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: JurnalCommentUncheckedUpdateManyWithoutJurnalNestedInput
  }

  export type JurnalUncheckedUpdateManyWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    tanggal?: DateTimeFieldUpdateOperationsInput | Date | string
    kegiatan?: StringFieldUpdateOperationsInput | string
    dokumentasi?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JurnalCommentCreateManyTeacherInput = {
    id?: string
    comment: string
    jurnalId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type JurnalCommentUpdateWithoutTeacherInput = {
    id?: StringFieldUpdateOperationsInput | string
    comment?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    jurnal?: JurnalUpdateOneRequiredWithoutCommentsNestedInput
  }

  export type JurnalCommentUncheckedUpdateWithoutTeacherInput = {
    id?: StringFieldUpdateOperationsInput | string
    comment?: StringFieldUpdateOperationsInput | string
    jurnalId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JurnalCommentUncheckedUpdateManyWithoutTeacherInput = {
    id?: StringFieldUpdateOperationsInput | string
    comment?: StringFieldUpdateOperationsInput | string
    jurnalId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentCreateManyTempatPklInput = {
    id?: string
    userId: string
    nisn: string
    kelas: string
    jurusan: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StudentUpdateWithoutTempatPklInput = {
    id?: StringFieldUpdateOperationsInput | string
    nisn?: StringFieldUpdateOperationsInput | string
    kelas?: StringFieldUpdateOperationsInput | string
    jurusan?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutStudentNestedInput
    jurnals?: JurnalUpdateManyWithoutStudentNestedInput
  }

  export type StudentUncheckedUpdateWithoutTempatPklInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    nisn?: StringFieldUpdateOperationsInput | string
    kelas?: StringFieldUpdateOperationsInput | string
    jurusan?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    jurnals?: JurnalUncheckedUpdateManyWithoutStudentNestedInput
  }

  export type StudentUncheckedUpdateManyWithoutTempatPklInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    nisn?: StringFieldUpdateOperationsInput | string
    kelas?: StringFieldUpdateOperationsInput | string
    jurusan?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JurnalCommentCreateManyJurnalInput = {
    id?: string
    comment: string
    teacherId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type JurnalCommentUpdateWithoutJurnalInput = {
    id?: StringFieldUpdateOperationsInput | string
    comment?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    teacher?: TeacherUpdateOneRequiredWithoutCommentsNestedInput
  }

  export type JurnalCommentUncheckedUpdateWithoutJurnalInput = {
    id?: StringFieldUpdateOperationsInput | string
    comment?: StringFieldUpdateOperationsInput | string
    teacherId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JurnalCommentUncheckedUpdateManyWithoutJurnalInput = {
    id?: StringFieldUpdateOperationsInput | string
    comment?: StringFieldUpdateOperationsInput | string
    teacherId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}