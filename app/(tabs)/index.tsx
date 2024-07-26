import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Keyboard,
  FlatList,
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
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredNotes = notes.filter((note) =>
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedNotes = filteredNotes.reduce((groups: any, note: any) => {
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

  const updateNoteOrder = (
    draggedData: Note[],
    draggedSectionTitle: string
  ) => {
    const updatedSections = sections.map((section) => {
      if (section.title === draggedSectionTitle) {
        return { ...section, data: draggedData };
      }
      return section;
    });

    const updatedNotes = updatedSections.flatMap((section) => section.data);
    setNotes(updatedNotes);
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Note>) => {
    const index = filteredNotes.findIndex((note) => note.id === item.id);
    return (
      <TouchableOpacity
        style={[
          styles.noteRow,
          index === filteredNotes.length - 1 && styles.lastNoteRow,
          { backgroundColor: isActive ? '#000' : '#000' },
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

  const renderSection = ({ item }: { item: any }) => (
    <View style={styles.listContainer}>
      <Text style={styles.subHeading}>{item.title}</Text>
      <DraggableFlatList
        data={item.data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onDragEnd={({ data }) => updateNoteOrder(data, item.title)}
      />
    </View>
  );

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
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder='Search something...'
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <FlatList
        data={sections}
        keyExtractor={(item) => item.title}
        renderItem={renderSection}
      />
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
    marginBottom: 28,
  },
  searchContainer: {
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
    marginRight: 10,
  },
  categoryInput: {
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
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
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    paddingTop: 4,
    marginBottom: 28,
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
