import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Keyboard,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';

interface Note {
  id: string;
  content: string;
  category: string;
}

const HomeScreen: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<string>('');
  const [currentCategory, setCurrentCategory] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  const addNote = () => {
    if (currentNote.trim() !== '') {
      setNotes([
        ...notes,
        {
          id: Math.random().toString(),
          content: currentNote,
          category: currentCategory,
        },
      ]);
      setCurrentNote('');
      setCurrentCategory('');
      Keyboard.dismiss(); // Đóng bàn phím
    }
  };

  const editNote = (noteId: string) => {
    const noteToEdit = notes.find((note) => note.id === noteId);
    if (noteToEdit) {
      setCurrentNote(noteToEdit.content);
      setCurrentCategory(noteToEdit.category);
      setIsEditing(true);
      setEditingNoteId(noteId);
    }
  };

  const updateNote = () => {
    setNotes(
      notes.map((note) =>
        note.id === editingNoteId
          ? { ...note, content: currentNote, category: currentCategory }
          : note
      )
    );
    setCurrentNote('');
    setCurrentCategory('');
    setIsEditing(false);
    setEditingNoteId(null);
    Keyboard.dismiss(); // Đóng bàn phím
  };

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId));
  };

  const clearInput = () => {
    setCurrentNote('');
    setCurrentCategory('');
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Note>) => {
    const index = notes.findIndex((note) => note.id === item.id);
    return (
      <TouchableOpacity
        style={[
          styles.noteRow,
          index === notes.length - 1 && styles.lastNoteRow,
          { backgroundColor: isActive ? '#eaeaeaS' : '#000' },
        ]}
        onLongPress={drag}
      >
        <Text style={styles.noteIndex}>{index + 1}. </Text>
        <View style={styles.noteContainer}>
          <Text style={styles.noteContent}>{item.content}</Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => editNote(item.id)}>
              <Icon name='edit' size={20} style={styles.editButton} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteNote(item.id)}>
              <Icon name='trash' size={20} style={styles.deleteButton} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const groupedNotes = notes.reduce((groups: any, note: any) => {
    const category = note.category || 'Uncategorized';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(note);
    return groups;
  }, {});

  const sections = Object.keys(groupedNotes).map((category) => ({
    title: category,
    data: groupedNotes[category],
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create a new todo...</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, styles.categoryInput]}
          placeholder='Enter type'
          value={currentCategory}
          onChangeText={setCurrentCategory}
        />
        <TextInput
          style={styles.input}
          placeholder='Enter note'
          value={currentNote}
          onChangeText={setCurrentNote}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={isEditing ? updateNote : addNote}
          >
            <Text style={styles.buttonText}>
              {isEditing ? 'Update' : 'Create'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.clearButton]}
            onPress={clearInput}
          >
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={{ flex: 1 }}>
        {sections.map((section) => (
          <View style={styles.listContainer} key={section.title}>
            <Text style={styles.subHeading}>{section.title}</Text>
            <DraggableFlatList
              data={section.data}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              onDragEnd={({ data }) => setNotes(data)}
              contentContainerStyle={styles.flatListContent}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 70,
  },
  heading: {
    color: '#fff',
    fontSize: 32,
    marginBottom: 26,
  },
  subHeading: {
    color: '#fff',
    fontSize: 32,
    textAlign: 'center',
    padding: 20,
    paddingBottom: 18,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 38,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    color: '#fff',
    borderRadius: 8,
  },
  categoryInput: {
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginLeft: 5,
  },
  clearButton: {
    backgroundColor: '#FF0000',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  listContainer: {
    // flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    paddingTop: 4,
  },
  flatListContent: {
    // borderWidth: 1,
    // borderColor: 'rgba(255, 255, 255, 0.2)',
    // borderRadius: 8,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    // padding: 20,
    // paddingTop: 4,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  lastNoteRow: {
    marginBottom: 4,
  },
  noteContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 2,
    paddingLeft: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  noteIndex: {
    color: '#fff',
    marginRight: 8,
    alignSelf: 'flex-end',
    fontSize: 28,
  },
  noteContent: {
    flex: 1,
    color: '#fff',
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
  },
  editButton: {
    marginRight: 10,
    color: '#007BFF',
  },
  deleteButton: {
    color: 'red',
  },
});

export default HomeScreen;
