import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../index';
import { RouteProp } from '@react-navigation/native';
import { TRELLO_API_KEY, TRELLO_API_TOKEN } from '@env';

type BoardsRouteProp = RouteProp<RootStackParamList, 'Boards'>;
type BoardsNavigationProp = StackNavigationProp<RootStackParamList, 'Boards'>;

type Props = {
  route: BoardsRouteProp;
  navigation: BoardsNavigationProp;
};

type Board = {
  id: string;
  name: string;
};

const Boards: React.FC<Props> = ({ route, navigation }) => {
  const { organizationId } = route.params;
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get(
          `https://api.trello.com/1/organizations/${organizationId}/boards?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_API_TOKEN}`
        );
        setBoards(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des tableaux:', error);
      }
    };
    fetchBoards();
  }, [organizationId]);

  return (
    <View>
      <FlatList
        data={boards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('ListAndCards', { boardId: item.id })}>
            <Text style={{ padding: 10, fontSize: 18 }}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Boards;
