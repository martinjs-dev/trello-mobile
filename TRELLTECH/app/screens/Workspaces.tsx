import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { TRELLO_API_KEY, TRELLO_API_TOKEN } from '@env';

type WorkspacesNavigationProp = StackNavigationProp<RootStackParamList, 'Workspaces'>;

type Props = {
  navigation: WorkspacesNavigationProp;
};

type Workspace = {
  id: string;
  displayName: string;
};

const Workspaces: React.FC<Props> = ({ navigation }) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        setLoading(true);
        setError(null); // Réinitialise les erreurs à chaque requête
        const response = await axios.get(
          `https://api.trello.com/1/members/me/organizations?key=${TRELLO_API_KEY}&token=${TRELLO_API_TOKEN}`
        );
        console.log('Espaces de travail:', response.data);
        setWorkspaces(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des espaces de travail:', error);
        setError("Impossible de charger les espaces de travail. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };
    fetchWorkspaces();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <View>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : workspaces.length > 0 ? (
        <FlatList
          data={workspaces}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('Boards', { organizationId: item.id })}>
              <Text style={styles.workspaceItem}>{item.displayName}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noWorkspacesText}>Aucun espace de travail trouvé.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  workspaceItem: {
    padding: 10,
    fontSize: 18,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  noWorkspacesText: {
    padding: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Workspaces;
