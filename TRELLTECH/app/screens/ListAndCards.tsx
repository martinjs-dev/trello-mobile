import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import axios from 'axios';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../index';
import { TRELLO_API_KEY, TRELLO_API_TOKEN } from '@env';

type ListAndCardsRouteProp = RouteProp<RootStackParamList, 'ListAndCards'>;

type Props = {
  route: ListAndCardsRouteProp;
};

type List = {
  id: string;
  name: string;
};

type Card = {
  id: string;
  name: string;
};

const ListAndCards: React.FC<Props> = ({ route }) => {
  const { boardId } = route.params;
  const [lists, setLists] = useState<List[]>([]);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await axios.get(
          `https://api.trello.com/1/boards/${boardId}/lists?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_API_TOKEN}`
        );
        setLists(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des listes:', error);
      }
    };
    fetchLists();
  }, [boardId]);

  return (
    <View>
      <FlatList
        data={lists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text style={{ padding: 10, fontSize: 18 }}>{item.name}</Text>
            <Cards listId={item.id} />
          </View>
        )}
      />
    </View>
  );
};

const Cards: React.FC<{ listId: string }> = ({ listId }) => {
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get(
          `https://api.trello.com/1/lists/${listId}/cards?key=${TRELLO_API_KEY}&token=${TRELLO_API_TOKEN}`
        );
        setCards(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des cartes:', error);
      }
    };
    fetchCards();
  }, [listId]);

  return (
    <FlatList
      data={cards}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Text style={{ paddingLeft: 20, fontSize: 16 }}>- {item.name}</Text>
      )}
    />
  );
};

export default ListAndCards;
