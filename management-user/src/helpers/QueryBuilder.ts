export class QueryBuilder {
  static async createQuery<T>(model: any, input: any): Promise<T> {
    const result: T = await model.create({
      data: { ...input },
    })
    return result
  }

  static async findOneByParameterQuery<T>(
    model: any,
    args: any = { where: undefined },
  ): Promise<T> {
    const result: T = await model.findFirst({ ...args })
    return result
  }

  static async updateQuery<T>(model: any, args: any): Promise<T> {
    const result: T = await model.update({ ...args })
    return result
  }

  static async findAllQuery<T>(
    model: any,
    args: any = { where: undefined },
  ): Promise<T> {
    const result: T = await model.findMany({ ...args })
    return result
  }

  static async deleteQuery<T>(model: any, args: any) {
    const result: T = await model.delete({ ...args })
    return result
  }
}
