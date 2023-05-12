import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { CardTask } from "../components/CardTask";
import { getTasks, updateTask, addTask, removeTask } from "../api/task";

export const TaskScreen = ({ navigation }) => {
  const queryClient = useQueryClient();
  const { isLoading, error, data, isFetching } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const updateMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const addMutation = useMutation({
    mutationFn: addTask,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeTask,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleAddTask = () => {
    navigation.navigate("AddTask", {
      addTask: addMutation.mutate,
    });
  };

  const handleRemoveTask = (objectId) => {
    removeMutation.mutate(objectId);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Loading</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data.results}
        keyExtractor={(item) => item.objectId}
        renderItem={({ item }) => (
          <CardTask
            task={item}
            navigation={navigation}
            taskDoneChange={updateMutation.mutate}
            onRemove={handleRemoveTask}
          />
        )}
      />
    </View>
  );
};

TaskScreen.navigationOptions = ({ navigation }) => {
  return {
    headerRight: () => (
      <View style={{ marginRight: 16 }}>
        <TouchableOpacity onPress={() => navigation.navigate("AddTask")}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    ),
    headerLeft: () => (
      <View style={{ marginLeft: 16 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    ),
  };
};
