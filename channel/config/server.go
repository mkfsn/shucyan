package config

type Secret struct {
	Type  string `yaml:"type"`
	Value string `yaml:"value"`
}

type Server struct {
	Debug    bool     `yaml:"debug"`
	Secrets  []Secret `yaml:"secrets"`
	Database string   `yaml:"database"`
}
