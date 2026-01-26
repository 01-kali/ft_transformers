@Patch(':userId')
async updateUser(@Param('userId') id: string, @Body() data: object){
  await this.usersService.update(+id, data);
}
@Delete(':projectId')
async deleteProject(@Param('projectId', ParseIntPipe) id: number){
  return await this.projectsService.remove(id)
}
