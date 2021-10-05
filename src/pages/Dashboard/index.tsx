import { useEffect, useState } from 'react';


import { api } from '../../services/api';
import { Header } from '../../components/Header';
import { Food } from '../../components/Food';
import {ModalAddFood} from '../../components/ModalAddFood';
import {ModalEditFood} from '../../components/ModalEditFood';



import {FoodObject} from '../../@types/types';


import { FoodsContainer } from './styles';

export function Dashboard(){
  const [foods, setFoods] = useState<FoodObject[]>([]);
  const [editingFood, setEditingFood] = useState({} as FoodObject);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  useEffect(() => {
    async function loadFoods() {
      const foods = await api.get('/foods')
      setFoods(foods.data)
    }
    loadFoods()
  },[])

  async function handleAddFood(food: FoodObject){
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods((foods) => [...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: FoodObject){
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food }
      );
    
      const foodsUpdated = foods.map((food) =>
        food.id !== foodUpdated.data.id ? food : foodUpdated.data
      );
        
        
      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number){
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  function handleEditFood(food: FoodObject) {
    setEditingFood(food);
    setIsEditModalOpen(true);
  }

  function toggleModal() {

    setIsAddModalOpen((state) => !state);
  }

  function toggleEditModal() {

   setIsEditModalOpen((state) => !state);
  }
    return (
      <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={isAddModalOpen}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={isEditModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                key={food.id}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
    );
};
