export class Order {
  ordernumber: string
  rmsorder: string
  qtytotal: number
  scheduleyear: string
  scheduleweek: string
  scheduleinitialdate: string
  schedulefinaldate: string
  orderorigin: string
  ordertype: string
  status: string
  dtcreate: string
  dtupdated: string
  supplierid: number
  deletedat: string
  createdat: string
  updatedat: string
  blockchainhash: string
  suppliername: string
  suppliercnpj: string

  constructor({
    id: ordernumber,
    rms_pedido: rmsorder,
    qty_total: qtytotal,
    schedule_year: scheduleyear,
    schedule_week: scheduleweek,
    schedule_initial_date: scheduleinitialdate,
    schedule_final_date: schedulefinaldate,
    origem_pedido: orderorigin,
    order_type: ordertype,
    status: status,
    data_registro_pedido: dtcreate,
    dt_updated: dtupdated,
    fornecedor_id: supplierid,
    deleted_at: deletedat,
    created_at: createdat,
    updated_at: updatedat,
    blockchain_hash: blockchainhash,
    nome: suppliername,
    cnpj: suppliercnpj
  }) {
    this.ordernumber = ordernumber
    this.rmsorder = rmsorder
    this.qtytotal = qtytotal
    this.scheduleyear = scheduleyear
    this.scheduleweek = scheduleweek
    this.scheduleinitialdate = scheduleinitialdate
    this.schedulefinaldate = schedulefinaldate
    this.orderorigin = orderorigin
    this.ordertype = ordertype
    this.status = status
    this.dtcreate = dtcreate
    this.dtupdated = dtupdated
    this.supplierid = supplierid
    this.deletedat = deletedat
    this.createdat = createdat
    this.updatedat = updatedat
    this.blockchainhash = blockchainhash
    this.suppliername = suppliername
    this.suppliercnpj = suppliercnpj
  }

  toJSON() {
    return { ...this }
  }
}
