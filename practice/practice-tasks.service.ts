function updateProduct (id: number, data: object){
  this.prisma.product.update({
    where: {id: id}, 
    data: data,
  });
}
async deleteProduct(id: number){
  this.prisma.product.delete({
    where: {id: id},
  });
  this.tasksGateway.server.emit('productDeleted', id);
}
