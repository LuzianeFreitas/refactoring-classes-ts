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
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

  useEffect(() => {
    api.get('/foods')
      .then(response => setFoods(response.data));
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
      const {data: foodUpdated} = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.id ? f : foodUpdated.data,
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

  function toggleModal() {

    setModalOpen(!modalOpen);
  }

  function toggleEditModal() {

   setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: FoodObject) {
    setEditingFood(food);
    setEditModalOpen(true);
  }


    return (
      <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={modalOpen}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={editModalOpen}
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
